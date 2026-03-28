// ============================================================
// Servicio principal de KYC
// Maneja la lógica de negocio de las solicitudes KYC
// ============================================================

import * as path from 'path';
import * as fs from 'fs';
import { query, getClient } from '../db/connection';
import { registrarAuditoria } from './auditoria.service';
import { crearErpAdapter } from '../adapters/erp.adapter';
import {
  KycSubmission,
  KycDocumento,
  TipoPersona,
  TipoDocumento,
  ValidacionDocumentoRespuesta,
  ErpPayload,
  DatosRegistroCivil,
} from '../types';
import logger from '../utils/logger';

// ============================================================
// Gestión de KYC Submissions
// ============================================================

/**
 * Crea o actualiza una solicitud KYC en estado borrador.
 * Si ya existe una solicitud en borrador para la cédula, la retorna.
 */
export async function crearOActualizarKyc(params: {
  cedula: string;
  tipoPersona: TipoPersona;
  nombres?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  datosRegistroCivil?: Record<string, unknown>;
  ingresoManual?: boolean;
  creadoPor?: string;
}): Promise<KycSubmission> {
  const {
    cedula,
    tipoPersona,
    nombres,
    fechaNacimiento,
    estadoCivil,
    datosRegistroCivil,
    ingresoManual = false,
    creadoPor,
  } = params;

  const rows = await query<Record<string, unknown>>(
    `INSERT INTO kyc_submissions
       (cedula, tipo_persona, nombres, fecha_nacimiento, estado_civil,
        datos_registro_civil, ingreso_manual, creado_por)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      cedula,
      tipoPersona,
      nombres || null,
      fechaNacimiento || null,
      estadoCivil || null,
      datosRegistroCivil ? JSON.stringify(datosRegistroCivil) : null,
      ingresoManual,
      creadoPor || null,
    ]
  );

  const kyc = filaAKycSubmission(rows[0]);

  await registrarAuditoria({
    kycId: kyc.id,
    accion: 'KYC_CREADO',
    detalle: { cedula, tipoPersona, ingresoManual },
    usuario: creadoPor,
  });

  logger.info('KYC creado', { id: kyc.id, cedula, tipoPersona });
  return kyc;
}

/**
 * Obtiene una solicitud KYC por ID.
 */
export async function obtenerKycPorId(id: string): Promise<KycSubmission | null> {
  const rows = await query<Record<string, unknown>>(
    'SELECT * FROM kyc_submissions WHERE id = $1',
    [id]
  );
  return rows.length > 0 ? filaAKycSubmission(rows[0]) : null;
}

// ============================================================
// Gestión de Documentos
// ============================================================

/**
 * Registra un documento subido en la base de datos.
 */
export async function registrarDocumento(params: {
  kycId: string;
  tipo: TipoDocumento;
  nombreArchivo: string;
  rutaArchivo: string;
  mimeType: string;
  usuario?: string;
}): Promise<KycDocumento> {
  const { kycId, tipo, nombreArchivo, rutaArchivo, mimeType, usuario } = params;

  const rows = await query<Record<string, unknown>>(
    `INSERT INTO kyc_documentos (kyc_id, tipo, nombre_archivo, ruta_archivo, mime_type)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [kycId, tipo, nombreArchivo, rutaArchivo, mimeType]
  );

  const doc = filaAKycDocumento(rows[0]);

  await registrarAuditoria({
    kycId,
    accion: 'DOCUMENTO_SUBIDO',
    detalle: { tipo, nombreArchivo, mimeType },
    usuario,
  });

  logger.info('Documento registrado', { id: doc.id, kycId, tipo });
  return doc;
}

/**
 * Actualiza el estado de validación de un documento.
 */
export async function actualizarValidacionDocumento(
  documentoId: string,
  validacion: ValidacionDocumentoRespuesta,
  usuario?: string
): Promise<KycDocumento> {
  const rows = await query<Record<string, unknown>>(
    `UPDATE kyc_documentos
     SET validado = $1,
         validacion_respuesta = $2,
         validado_en = NOW()
     WHERE id = $3
     RETURNING *`,
    [validacion.valido, JSON.stringify(validacion), documentoId]
  );

  if (rows.length === 0) {
    throw new Error(`Documento ${documentoId} no encontrado`);
  }

  const doc = filaAKycDocumento(rows[0]);

  await registrarAuditoria({
    kycId: doc.kycId,
    accion: 'DOCUMENTO_VALIDADO',
    detalle: {
      documentoId,
      valido: validacion.valido,
      confianza: validacion.confianza,
      motivo: validacion.motivo,
    },
    usuario,
  });

  return doc;
}

/**
 * Obtiene todos los documentos de una solicitud KYC.
 */
export async function obtenerDocumentosKyc(kycId: string): Promise<KycDocumento[]> {
  const rows = await query<Record<string, unknown>>(
    'SELECT * FROM kyc_documentos WHERE kyc_id = $1 ORDER BY creado_en ASC',
    [kycId]
  );
  return rows.map(filaAKycDocumento);
}

/**
 * Obtiene un documento por su ID.
 */
export async function obtenerDocumentoPorId(id: string): Promise<KycDocumento | null> {
  const rows = await query<Record<string, unknown>>(
    'SELECT * FROM kyc_documentos WHERE id = $1',
    [id]
  );
  return rows.length > 0 ? filaAKycDocumento(rows[0]) : null;
}

// ============================================================
// Envío al ERP
// ============================================================

/**
 * Envía una solicitud KYC completa al ERP.
 * Valida que todos los documentos requeridos estén validados antes de enviar.
 */
export async function enviarKycAlErp(
  kycId: string,
  usuario?: string,
  ip?: string
): Promise<{ referencia: string; mensaje: string }> {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Obtener el KYC
    const kycRows = await client.query('SELECT * FROM kyc_submissions WHERE id = $1', [kycId]);
    if (kycRows.rows.length === 0) {
      throw new Error(`KYC ${kycId} no encontrado`);
    }
    const kyc = filaAKycSubmission(kycRows.rows[0]);

    // Verificar que no haya sido enviado ya
    if (kyc.erpEnviado) {
      throw new Error('Este KYC ya fue enviado al ERP');
    }

    // Obtener documentos
    const docRows = await client.query(
      'SELECT * FROM kyc_documentos WHERE kyc_id = $1',
      [kycId]
    );
    const documentos = docRows.rows.map(filaAKycDocumento);

    // Verificar que todos los documentos estén validados
    const docNoValidados = documentos.filter((d) => !d.validado);
    if (docNoValidados.length > 0) {
      throw new Error(
        `Hay ${docNoValidados.length} documento(s) sin validar. Valide todos los documentos antes de enviar.`
      );
    }

    // Construir payload para el ERP
    const payload: ErpPayload = {
      kyc_id: kyc.id,
      tipo_persona: kyc.tipoPersona,
      cedula: kyc.cedula,
      nombres: kyc.nombres || '',
      fecha_nacimiento: kyc.fechaNacimiento || '',
      estado_civil: kyc.estadoCivil || '',
      documentos: documentos.map((d) => ({
        tipo: d.tipo,
        ruta: d.rutaArchivo || '',
        validado: d.validado,
        validado_en: d.validadoEn?.toISOString() || new Date().toISOString(),
      })),
      creado_en: kyc.creadoEn.toISOString(),
      creado_por: kyc.creadoPor || usuario || '',
    };

    // Enviar al ERP
    const erp = crearErpAdapter();
    const respuesta = await erp.enviarKyc(payload);

    // Actualizar estado en la base de datos
    await client.query(
      `UPDATE kyc_submissions
       SET estado = 'pendiente',
           erp_enviado = TRUE,
           erp_enviado_en = NOW(),
           erp_respuesta = $1,
           actualizado_en = NOW()
       WHERE id = $2`,
      [JSON.stringify(respuesta), kycId]
    );

    await client.query('COMMIT');

    await registrarAuditoria({
      kycId,
      accion: 'KYC_ENVIADO_ERP',
      detalle: {
        referencia: respuesta.referencia,
        mensaje: respuesta.mensaje,
      },
      usuario,
      ip,
    });

    logger.info('KYC enviado al ERP exitosamente', {
      kycId,
      referencia: respuesta.referencia,
    });

    return {
      referencia: respuesta.referencia || '',
      mensaje: respuesta.mensaje,
    };
  } catch (error) {
    await client.query('ROLLBACK');

    await registrarAuditoria({
      kycId,
      accion: 'KYC_ERROR_ERP',
      detalle: {
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      usuario,
      ip,
    });

    throw error;
  } finally {
    client.release();
  }
}

// ============================================================
// Helpers: mapeo de filas DB a tipos TypeScript
// ============================================================

function filaAKycSubmission(fila: Record<string, unknown>): KycSubmission {
  return {
    id: fila['id'] as string,
    cedula: fila['cedula'] as string,
    nombres: fila['nombres'] as string | undefined,
    fechaNacimiento: fila['fecha_nacimiento'] as string | undefined,
    estadoCivil: fila['estado_civil'] as string | undefined,
    tipoPersona: fila['tipo_persona'] as 'natural' | 'juridica',
    estado: fila['estado'] as 'borrador' | 'pendiente' | 'aprobado' | 'rechazado',
    datosRegistroCivil: fila['datos_registro_civil'] as DatosRegistroCivil | undefined,
    ingresoManual: fila['ingreso_manual'] as boolean,
    erpEnviado: fila['erp_enviado'] as boolean,
    erpEnviadoEn: fila['erp_enviado_en'] as Date | undefined,
    erpRespuesta: fila['erp_respuesta'] as Record<string, unknown> | undefined,
    creadoPor: fila['creado_por'] as string | undefined,
    creadoEn: fila['creado_en'] as Date,
    actualizadoEn: fila['actualizado_en'] as Date,
  };
}

function filaAKycDocumento(fila: Record<string, unknown>): KycDocumento {
  return {
    id: fila['id'] as string,
    kycId: fila['kyc_id'] as string,
    tipo: fila['tipo'] as TipoDocumento,
    nombreArchivo: fila['nombre_archivo'] as string | undefined,
    rutaArchivo: fila['ruta_archivo'] as string | undefined,
    mimeType: fila['mime_type'] as string | undefined,
    validado: fila['validado'] as boolean,
    validacionRespuesta: fila['validacion_respuesta'] as ValidacionDocumentoRespuesta | undefined,
    validadoEn: fila['validado_en'] as Date | undefined,
    creadoEn: fila['creado_en'] as Date,
  };
}
