import { Pool, PoolClient } from 'pg';
import logger from '../utils/logger';

// ============================================================
// Conexión a PostgreSQL mediante pool de conexiones
// ============================================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                  // Máximo de conexiones simultáneas
  idleTimeoutMillis: 30000, // Cerrar conexiones inactivas tras 30s
  connectionTimeoutMillis: 2000,
});

// Evento de conexión exitosa
pool.on('connect', () => {
  logger.debug('Nueva conexión establecida con PostgreSQL');
});

// Evento de error en el pool
pool.on('error', (err) => {
  logger.error('Error inesperado en el pool de PostgreSQL', { error: err.message });
});

/**
 * Ejecuta una consulta SQL y retorna los resultados
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duracion = Date.now() - start;
    logger.debug('Consulta ejecutada', { duracion: `${duracion}ms`, filas: res.rowCount });
    return res.rows as T[];
  } catch (error) {
    logger.error('Error ejecutando consulta SQL', {
      consulta: text,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

/**
 * Obtiene un cliente del pool para transacciones manuales
 */
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Verifica la conexión con la base de datos
 */
export async function testConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    logger.info('Conexión a PostgreSQL verificada correctamente');
    return true;
  } catch (error) {
    logger.error('No se pudo conectar a PostgreSQL', {
      error: error instanceof Error ? error.message : error,
    });
    return false;
  }
}

export default pool;
