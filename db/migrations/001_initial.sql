-- ============================================================
-- Migración inicial: Módulo KYC - Seguros Latina
-- Versión: 1.0.0
-- Fecha: 2024
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Tabla: kyc_submissions
-- Almacena las solicitudes KYC de cada cliente
-- ============================================================
CREATE TABLE IF NOT EXISTS kyc_submissions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cedula              VARCHAR(10) NOT NULL,
  nombres             VARCHAR(200),
  fecha_nacimiento    DATE,
  estado_civil        VARCHAR(50),
  tipo_persona        VARCHAR(20) NOT NULL CHECK (tipo_persona IN ('natural', 'juridica')),
  estado              VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'pendiente', 'aprobado', 'rechazado')),
  datos_registro_civil JSONB,
  ingreso_manual      BOOLEAN DEFAULT FALSE,
  erp_enviado         BOOLEAN DEFAULT FALSE,
  erp_enviado_en      TIMESTAMP,
  erp_respuesta       JSONB,
  creado_por          VARCHAR(100),
  creado_en           TIMESTAMP DEFAULT NOW(),
  actualizado_en      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Tabla: kyc_documentos
-- Almacena los documentos subidos por cada solicitud KYC
-- ============================================================
CREATE TABLE IF NOT EXISTS kyc_documentos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_id              UUID REFERENCES kyc_submissions(id) ON DELETE CASCADE,
  tipo                VARCHAR(50) NOT NULL,
  nombre_archivo      VARCHAR(255),
  ruta_archivo        VARCHAR(500),
  mime_type           VARCHAR(100),
  validado            BOOLEAN DEFAULT FALSE,
  validacion_respuesta JSONB,
  validado_en         TIMESTAMP,
  creado_en           TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Tabla: kyc_auditoria
-- Registro completo de auditoría para cada acción KYC
-- ============================================================
CREATE TABLE IF NOT EXISTS kyc_auditoria (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_id    UUID REFERENCES kyc_submissions(id) ON DELETE SET NULL,
  accion    VARCHAR(100) NOT NULL,
  detalle   JSONB,
  usuario   VARCHAR(100),
  ip        VARCHAR(45),
  creado_en TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Índices para mejorar el rendimiento
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_cedula ON kyc_submissions(cedula);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_estado ON kyc_submissions(estado);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_creado_por ON kyc_submissions(creado_por);
CREATE INDEX IF NOT EXISTS idx_kyc_documentos_kyc_id ON kyc_documentos(kyc_id);
CREATE INDEX IF NOT EXISTS idx_kyc_auditoria_kyc_id ON kyc_auditoria(kyc_id);
CREATE INDEX IF NOT EXISTS idx_kyc_auditoria_creado_en ON kyc_auditoria(creado_en);

-- ============================================================
-- Función: actualizar timestamp de actualización automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para kyc_submissions
CREATE TRIGGER trg_kyc_submissions_actualizar
  BEFORE UPDATE ON kyc_submissions
  FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
