// ============================================================
// Servicio de Auditoría
// Registra todas las acciones del módulo KYC para trazabilidad
// ============================================================

import { query } from '../db/connection';
import logger from '../utils/logger';

export interface RegistroAuditoria {
  kycId?: string;
  accion: string;
  detalle?: Record<string, unknown>;
  usuario?: string;
  ip?: string;
}

/**
 * Registra una acción en el log de auditoría.
 * No lanza excepciones para no interrumpir el flujo principal.
 */
export async function registrarAuditoria(registro: RegistroAuditoria): Promise<void> {
  try {
    await query(
      `INSERT INTO kyc_auditoria (kyc_id, accion, detalle, usuario, ip)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        registro.kycId || null,
        registro.accion,
        registro.detalle ? JSON.stringify(registro.detalle) : null,
        registro.usuario || null,
        registro.ip || null,
      ]
    );
    logger.debug('Auditoría registrada', { accion: registro.accion, kycId: registro.kycId });
  } catch (error) {
    // La auditoría no debe bloquear el flujo principal
    logger.error('Error registrando auditoría', {
      accion: registro.accion,
      error: error instanceof Error ? error.message : error,
    });
  }
}

/**
 * Obtiene el historial de auditoría de un KYC específico.
 */
export async function obtenerAuditoria(kycId: string): Promise<Record<string, unknown>[]> {
  const registros = await query<Record<string, unknown>>(
    `SELECT id, kyc_id, accion, detalle, usuario, ip, creado_en
     FROM kyc_auditoria
     WHERE kyc_id = $1
     ORDER BY creado_en ASC`,
    [kycId]
  );
  return registros;
}
