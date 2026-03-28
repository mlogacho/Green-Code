// ============================================================
// Rutas: Módulo KYC
// ============================================================

import { Router } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { authMiddleware } from '../middleware/auth';
import {
  uploadDocumento,
  validarDocumentoController,
  submitKyc,
  obtenerAuditoriaController,
  iniciarKyc,
} from '../controllers/kyc.controller';

const router = Router();

// Configuración de Multer para subida de archivos
const storagePath = process.env.STORAGE_PATH || './uploads';
const tempPath = path.join(storagePath, 'temp');

// Asegurar que el directorio temporal existe
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempPath);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Use JPG, PNG o PDF.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
});

// POST /api/kyc/init - Inicializar KYC
router.post('/init', authMiddleware, iniciarKyc);

// POST /api/kyc/upload - Subir documento
router.post('/upload', authMiddleware, upload.single('archivo'), uploadDocumento);

// POST /api/kyc/validate-document - Validar documento con OpenAI
router.post('/validate-document', authMiddleware, validarDocumentoController);

// POST /api/kyc/submit - Enviar KYC al ERP
router.post('/submit', authMiddleware, submitKyc);

// GET /api/kyc/audit/:id - Obtener auditoría
router.get('/audit/:id', authMiddleware, obtenerAuditoriaController);

export default router;
