// ============================================================
// Tipos globales del módulo KYC
// ============================================================

/**
 * Tipos de persona para KYC
 */
export type TipoPersona = 'natural' | 'juridica';

/**
 * Estados posibles de una solicitud KYC
 */
export type EstadoKyc = 'borrador' | 'pendiente' | 'aprobado' | 'rechazado';

/**
 * Tipos de documentos aceptados
 */
export type TipoDocumento =
  | 'cedula'
  | 'servicio_basico'
  | 'cedula_conyuge'
  | 'ruc'
  | 'cedula_representante'
  | 'nombramiento'
  | 'balances';

/**
 * Respuesta del Registro Civil
 */
export interface DatosRegistroCivil {
  cedula: string;
  nombres: string;
  fechaNacimiento: string;
  estadoCivil: string;
  fuenteDatos?: 'api' | 'mock';
}

/**
 * Solicitud KYC completa
 */
export interface KycSubmission {
  id: string;
  cedula: string;
  nombres?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  tipoPersona: TipoPersona;
  estado: EstadoKyc;
  datosRegistroCivil?: DatosRegistroCivil;
  ingresoManual: boolean;
  erpEnviado: boolean;
  erpEnviadoEn?: Date;
  erpRespuesta?: Record<string, unknown>;
  creadoPor?: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

/**
 * Documento KYC
 */
export interface KycDocumento {
  id: string;
  kycId: string;
  tipo: TipoDocumento;
  nombreArchivo?: string;
  rutaArchivo?: string;
  mimeType?: string;
  validado: boolean;
  validacionRespuesta?: ValidacionDocumentoRespuesta;
  validadoEn?: Date;
  creadoEn: Date;
}

/**
 * Respuesta de validación de documento por OpenAI
 */
export interface ValidacionDocumentoRespuesta {
  valido: boolean;
  motivo: string;
  confianza: number;
  advertencia?: string;
}

/**
 * Registro de auditoría
 */
export interface KycAuditoria {
  id: string;
  kycId?: string;
  accion: string;
  detalle?: Record<string, unknown>;
  usuario?: string;
  ip?: string;
  creadoEn: Date;
}

/**
 * Payload para el ERP
 */
export interface ErpPayload {
  kyc_id: string;
  tipo_persona: TipoPersona;
  cedula: string;
  nombres: string;
  fecha_nacimiento: string;
  estado_civil: string;
  documentos: {
    tipo: string;
    ruta: string;
    validado: boolean;
    validado_en: string;
  }[];
  creado_en: string;
  creado_por: string;
}

/**
 * Respuesta del ERP
 */
export interface ErpRespuesta {
  exito: boolean;
  mensaje: string;
  referencia?: string;
  datos?: Record<string, unknown>;
}

/**
 * Usuario autenticado extraído del JWT
 */
export interface UsuarioAutenticado {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

/**
 * Extiende Express Request con el usuario autenticado
 */
declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}
