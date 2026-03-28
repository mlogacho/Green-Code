import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// ============================================================
// Manejador global de errores
// ============================================================

export interface AppError extends Error {
  statusCode?: number;
  codigo?: string;
}

/**
 * Crea un error de aplicación con código de estado HTTP
 */
export function crearError(mensaje: string, statusCode = 500, codigo?: string): AppError {
  const error: AppError = new Error(mensaje);
  error.statusCode = statusCode;
  error.codigo = codigo;
  return error;
}

/**
 * Middleware de manejo de errores (debe ir al final de las rutas)
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const mensaje = statusCode === 500
    ? 'Error interno del servidor'
    : err.message;

  logger.error('Error en la aplicación', {
    statusCode,
    mensaje: err.message,
    codigo: err.codigo,
    ruta: req.path,
    metodo: req.method,
    ip: req.ip,
    usuario: req.usuario?.email,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    error: true,
    codigo: err.codigo || 'ERROR_INTERNO',
    mensaje,
    ...(process.env.NODE_ENV === 'development' && {
      detalle: err.message,
      stack: err.stack,
    }),
  });
}

/**
 * Middleware para rutas no encontradas (404)
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: true,
    codigo: 'RUTA_NO_ENCONTRADA',
    mensaje: `Ruta ${req.method} ${req.path} no encontrada`,
  });
}
