// ============================================================
// Punto de entrada del servidor KYC - Seguros Latina
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { testConnection } from './db/connection';
import cedulaRoutes from './routes/cedula.routes';
import kycRoutes from './routes/kyc.routes';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// Middleware global
// ============================================================

// CORS: permitir peticiones del frontend
const origenesPermitidos = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8050'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (curl, Postman, server-side)
      if (!origin) return callback(null, true);
      // En desarrollo o demo, permitir cualquier origen HTTP de la misma IP
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      // En producción, validar contra lista blanca
      if (origenesPermitidos.includes(origin)) return callback(null, true);
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// Rutas
// ============================================================

// Health check (sin autenticación)
app.get('/health', (_req, res) => {
  res.json({
    estado: 'ok',
    servicio: 'KYC Seguros Latina',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Rutas del módulo KYC
app.use('/api/cedula', cedulaRoutes);
app.use('/api/kyc', kycRoutes);

// Manejadores de errores (deben ir al final)
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================
// Inicialización del servidor
// ============================================================

async function iniciar(): Promise<void> {
  // Asegurar que el directorio de uploads existe
  const storagePath = process.env.STORAGE_PATH || './uploads';
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
    logger.info('Directorio de uploads creado', { ruta: storagePath });
  }

  // Asegurar que el directorio de logs existe
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs', { recursive: true });
  }

  // Verificar conexión a la base de datos
  const dbConectada = await testConnection();
  if (!dbConectada) {
    logger.error('No se pudo conectar a la base de datos. Verifique DATABASE_URL.');
    logger.warn('El servidor iniciará pero las funciones de base de datos fallarán.');
  }

  app.listen(PORT, () => {
    logger.info(`Servidor KYC iniciado en puerto ${PORT}`, {
      entorno: process.env.NODE_ENV || 'development',
      puerto: PORT,
    });
  });
}

iniciar().catch((error) => {
  logger.error('Error fatal al iniciar el servidor', { error });
  process.exit(1);
});
