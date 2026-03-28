// ============================================================
// Controlador principal de KYC
// Maneja upload de documentos, validación y envío al ERP
// ============================================================

import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import {
  crearOActualizarKyc,
  registrarDocumento,
  actualizarValidacionDocumento,
  obtenerDocumentosKyc,
  obtenerDocumentoPorId,
  enviarKycAlErp,
} from '../services/kyc.service';
import { validarDocumento } from '../services/documentValidation.service';
import { obtenerAuditoria } from '../services/auditoria.service';
import { crearError } from '../middleware/errorHandler';
import { TipoDocumento, TipoPersona } from '../types';
import logger from '../utils/logger';

// ============================================================
// POST /api/kyc/upload
// Sube un documento y lo registra en la BD
// ============================================================
export async function uploadDocumento(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const archivo = req.file;
    if (!archivo) {
      throw crearError('No se recibió ningún archivo', 400, 'ARCHIVO_REQUERIDO');
    }

    const { kycId, tipo, cedula, tipoPersona, nombres, fechaNacimiento, estadoCivil, ingresoManual } = req.body;

    if (!tipo) {
      throw crearError('El tipo de documento es requerido', 400, 'TIPO_REQUERIDO');
    }

    // Tipos de documentos válidos
    const tiposValidos: TipoDocumento[] = [
      'cedula', 'servicio_basico', 'cedula_conyuge',
      'ruc', 'cedula_representante', 'nombramiento', 'balances',
    ];

    if (!tiposValidos.includes(tipo as TipoDocumento)) {
      throw crearError(`Tipo de documento inválido: ${tipo}`, 400, 'TIPO_INVALIDO');
    }

    let kycIdFinal = kycId;

    // Si no se proporciona kycId, crear uno nuevo
    if (!kycIdFinal) {
      if (!cedula || !tipoPersona) {
        throw crearError('Se requiere cedula y tipoPersona para crear un KYC', 400, 'DATOS_REQUERIDOS');
      }

      const kyc = await crearOActualizarKyc({
        cedula,
        tipoPersona: tipoPersona as TipoPersona,
        nombres,
        fechaNacimiento,
        estadoCivil,
        ingresoManual: ingresoManual === 'true',
        creadoPor: req.usuario?.email,
      });
      kycIdFinal = kyc.id;
    }

    // Mover el archivo a la carpeta del KYC
    const storagePath = process.env.STORAGE_PATH || './uploads';
    const kycDir = path.join(storagePath, kycIdFinal);
    if (!fs.existsSync(kycDir)) {
      fs.mkdirSync(kycDir, { recursive: true });
    }

    const nombreFinal = `${tipo}_${Date.now()}${path.extname(archivo.originalname)}`;
    const rutaFinal = path.join(kycDir, nombreFinal);

    fs.renameSync(archivo.path, rutaFinal);

    const documento = await registrarDocumento({
      kycId: kycIdFinal,
      tipo: tipo as TipoDocumento,
      nombreArchivo: archivo.originalname,
      rutaArchivo: rutaFinal,
      mimeType: archivo.mimetype,
      usuario: req.usuario?.email,
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Documento subido exitosamente',
      datos: {
        documentoId: documento.id,
        kycId: kycIdFinal,
        tipo: documento.tipo,
        nombreArchivo: documento.nombreArchivo,
        mimeType: documento.mimeType,
      },
    });
  } catch (error) {
    // Limpiar archivo temporal si hubo error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
}

// ============================================================
// POST /api/kyc/validate-document
// Valida un documento usando OpenAI GPT-4o Vision
// ============================================================
export async function validarDocumentoController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { documentoId } = req.body;

    if (!documentoId) {
      throw crearError('El ID del documento es requerido', 400, 'DOCUMENTO_ID_REQUERIDO');
    }

    const documento = await obtenerDocumentoPorId(documentoId);
    if (!documento) {
      throw crearError('Documento no encontrado', 404, 'DOCUMENTO_NO_ENCONTRADO');
    }

    if (!documento.rutaArchivo || !fs.existsSync(documento.rutaArchivo)) {
      throw crearError('Archivo del documento no encontrado en el servidor', 404, 'ARCHIVO_NO_ENCONTRADO');
    }

    logger.info('Iniciando validación de documento', {
      documentoId,
      tipo: documento.tipo,
    });

    const validacion = await validarDocumento(
      documento.rutaArchivo,
      documento.tipo,
      documento.mimeType || 'image/jpeg'
    );

    const documentoActualizado = await actualizarValidacionDocumento(
      documentoId,
      validacion,
      req.usuario?.email
    );

    // Si el documento es inválido, retornar 422
    if (!validacion.valido) {
      res.status(422).json({
        exito: false,
        codigo: 'DOCUMENTO_INVALIDO',
        mensaje: `El documento no es válido: ${validacion.motivo}`,
        datos: {
          documentoId,
          validacion,
        },
      });
      return;
    }

    res.json({
      exito: true,
      mensaje: validacion.advertencia
        ? `Documento validado con advertencia: ${validacion.advertencia}`
        : 'Documento validado exitosamente',
      datos: {
        documentoId,
        validacion,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================
// POST /api/kyc/submit
// Envía el KYC completo al ERP
// ============================================================
export async function submitKyc(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { kycId } = req.body;

    if (!kycId) {
      throw crearError('El ID del KYC es requerido', 400, 'KYC_ID_REQUERIDO');
    }

    logger.info('Enviando KYC al ERP', {
      kycId,
      usuario: req.usuario?.email,
    });

    const resultado = await enviarKycAlErp(
      kycId,
      req.usuario?.email,
      req.ip
    );

    res.json({
      exito: true,
      mensaje: 'KYC enviado exitosamente al sistema',
      datos: resultado,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================
// GET /api/kyc/audit/:id
// Obtiene el historial de auditoría de un KYC
// ============================================================
export async function obtenerAuditoriaController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const registros = await obtenerAuditoria(id);

    res.json({
      exito: true,
      datos: registros,
      total: registros.length,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================
// POST /api/kyc/init
// Inicializa un KYC con los datos del cliente
// ============================================================
export async function iniciarKyc(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      cedula,
      tipoPersona,
      nombres,
      fechaNacimiento,
      estadoCivil,
      datosRegistroCivil,
      ingresoManual,
    } = req.body;

    if (!cedula || !tipoPersona) {
      throw crearError('cedula y tipoPersona son requeridos', 400, 'DATOS_REQUERIDOS');
    }

    const tiposValidos: TipoPersona[] = ['natural', 'juridica'];
    if (!tiposValidos.includes(tipoPersona)) {
      throw crearError('tipoPersona debe ser "natural" o "juridica"', 400, 'TIPO_PERSONA_INVALIDO');
    }

    const kyc = await crearOActualizarKyc({
      cedula,
      tipoPersona,
      nombres,
      fechaNacimiento,
      estadoCivil,
      datosRegistroCivil,
      ingresoManual: ingresoManual === true,
      creadoPor: req.usuario?.email,
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Solicitud KYC iniciada',
      datos: { kycId: kyc.id },
    });
  } catch (error) {
    next(error);
  }
}
