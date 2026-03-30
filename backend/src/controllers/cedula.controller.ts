// ============================================================
// Controlador: Consulta de Cédula en el Registro Civil
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { consultarCedula, validarCedula } from '../services/registroCivil.service';
import { registrarAuditoria } from '../services/auditoria.service';
import { crearError } from '../middleware/errorHandler';
import logger from '../utils/logger';

/**
 * GET /api/cedula/:numero
 * Consulta los datos de una cédula en el Registro Civil.
 */
export async function consultarCedulaController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { numero } = req.params;

    // Validar formato de cédula
    if (!validarCedula(numero)) {
      throw crearError('Número de cédula inválido', 400, 'CEDULA_INVALIDA');
    }

    logger.info('Consultando cédula', {
      cedula: numero,
      usuario: req.usuario?.email,
    });

    const datos = await consultarCedula(numero);

    await registrarAuditoria({
      accion: 'CONSULTA_CEDULA',
      detalle: { cedula: numero, fuenteDatos: datos.fuenteDatos },
      usuario: req.usuario?.email,
      ip: req.ip,
    });

    res.json({
      exito: true,
      datos,
    });
  } catch (error) {
    // Cédula no encontrada en la base de datos
    if (error instanceof Error && error.message.startsWith('CEDULA_NO_ENCONTRADA')) {
      res.status(404).json({
        exito: false,
        codigo: 'CEDULA_NO_ENCONTRADA',
        mensaje: 'Cédula no encontrada en el Registro Civil. Por favor ingrese los datos manualmente.',
      });
      return;
    }
    // Error de conexión al Registro Civil → ingreso manual
    if (error instanceof Error && error.message.includes('Registro Civil')) {
      logger.warn('Error consultando Registro Civil, activar ingreso manual', {
        error: error.message,
      });
      res.status(503).json({
        exito: false,
        codigo: 'REGISTRO_CIVIL_NO_DISPONIBLE',
        mensaje: 'El servicio del Registro Civil no está disponible. Por favor ingrese los datos manualmente.',
      });
      return;
    }
    next(error);
  }
}
