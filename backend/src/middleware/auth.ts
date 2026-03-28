import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioAutenticado } from '../types';
import logger from '../utils/logger';

// ============================================================
// Middleware de autenticación JWT
//
// En v1, acepta tanto el JWT real del portal de Seguros Latina
// como un token de prueba para desarrollo.
//
// Para producción: reemplazar la validación mock con la
// integración real al portal de Seguros Latina.
// ============================================================

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_seguros_latina_kyc';

// Token de prueba para desarrollo (NO usar en producción)
const TEST_TOKEN = 'test_token_kyc_dev_2024';

// Usuario de prueba que corresponde al TEST_TOKEN
const TEST_USER: UsuarioAutenticado = {
  id: 'dev-user-001',
  email: 'dev@seguroslatina.com',
  nombre: 'Usuario de Desarrollo',
  rol: 'agente',
};

/**
 * Valida el JWT del portal de Seguros Latina.
 * Extrae la información del usuario y la adjunta al request.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: 'No autorizado',
      mensaje: 'Se requiere token de autorización',
    });
    return;
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  // Token de desarrollo para pruebas
  if (process.env.NODE_ENV === 'development' && token === TEST_TOKEN) {
    req.usuario = TEST_USER;
    logger.debug('Autenticación con token de desarrollo', { usuario: TEST_USER.email });
    next();
    return;
  }

  try {
    // Validación del JWT real del portal de Seguros Latina
    const decoded = jwt.verify(token, JWT_SECRET) as UsuarioAutenticado;
    req.usuario = decoded;
    logger.debug('Autenticación exitosa', { usuario: decoded.email });
    next();
  } catch (error) {
    logger.warn('Token JWT inválido o expirado', {
      error: error instanceof Error ? error.message : 'Token inválido',
      ip: req.ip,
    });
    res.status(401).json({
      error: 'No autorizado',
      mensaje: 'Token inválido o expirado',
    });
  }
}
