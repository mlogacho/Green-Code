// ============================================================
// Rutas: Consulta de Cédula
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { consultarCedulaController } from '../controllers/cedula.controller';

const router = Router();

// GET /api/cedula/:numero
router.get('/:numero', authMiddleware, consultarCedulaController);

export default router;
