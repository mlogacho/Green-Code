// ============================================================
// Tipos del módulo KYC - Frontend
// ============================================================

export type TipoPersona = 'natural' | 'juridica';
export type EstadoKyc = 'borrador' | 'pendiente' | 'aprobado' | 'rechazado';
export type TipoDocumento =
  | 'cedula'
  | 'servicio_basico'
  | 'cedula_conyuge'
  | 'ruc'
  | 'cedula_representante'
  | 'nombramiento'
  | 'balances';

export type EstadoCivil = 'SOLTERO' | 'SOLTERA' | 'CASADO' | 'CASADA' | 'DIVORCIADO' | 'DIVORCIADA' | 'VIUDO' | 'VIUDA' | 'UNION_LIBRE';

/**
 * Datos obtenidos del Registro Civil
 */
export interface DatosRegistroCivil {
  cedula: string;
  nombres: string;
  fechaNacimiento: string;
  estadoCivil: string;
  fuenteDatos?: 'api' | 'mock';
}

/**
 * Estado de un documento en el formulario
 */
export interface EstadoDocumento {
  tipo: TipoDocumento;
  archivo?: File;
  documentoId?: string;
  validado: boolean;
  validacionRespuesta?: ValidacionDocumentoRespuesta;
  subiendo: boolean;
  validando: boolean;
  error?: string;
}

/**
 * Respuesta de validación de un documento
 */
export interface ValidacionDocumentoRespuesta {
  valido: boolean;
  motivo: string;
  confianza: number;
  advertencia?: string;
}

/**
 * Estado global del formulario KYC
 */
export interface EstadoFormulario {
  paso: number;
  kycId?: string;

  // Paso 1: Cédula
  cedula: string;
  datosRegistroCivil?: DatosRegistroCivil;
  ingresoManual: boolean;

  // Datos personales (del Registro Civil o ingresados manualmente)
  nombres: string;
  fechaNacimiento: string;
  estadoCivil: string;

  // Paso 2: Tipo de persona
  tipoPersona?: TipoPersona;

  // Paso 3: Documentos
  documentos: EstadoDocumento[];
}

/**
 * Definición de un tipo de documento requerido
 */
export interface DefinicionDocumento {
  tipo: TipoDocumento;
  etiqueta: string;
  descripcion: string;
  requerido: boolean;
  condicion?: (estadoCivil: string) => boolean;
}

/**
 * Respuesta genérica del API
 */
export interface ApiRespuesta<T = unknown> {
  exito: boolean;
  mensaje?: string;
  datos?: T;
  codigo?: string;
  error?: boolean;
}
