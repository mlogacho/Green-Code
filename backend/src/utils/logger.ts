import winston from 'winston';

// ============================================================
// Logger centralizado usando Winston
// ============================================================
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { servicio: 'kyc-backend' },
  transports: [
    // Consola con formato legible para desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length > 1
            ? ` | ${JSON.stringify(meta)}`
            : '';
          return `[${timestamp}] ${level}: ${message}${metaStr}`;
        })
      ),
    }),
    // Archivo de errores
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Archivo combinado
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

export default logger;
