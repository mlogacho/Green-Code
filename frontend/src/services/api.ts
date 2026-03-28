// ============================================================
// Servicio de API - Cliente HTTP para el backend KYC
// ============================================================

import axios, { AxiosError } from 'axios';
import { DatosRegistroCivil, TipoDocumento, TipoPersona, ValidacionDocumentoRespuesta } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Token de desarrollo (en producción vendrá del portal de Seguros Latina)
const getAuthToken = (): string => {
  return localStorage.getItem('kyc_token') || 'test_token_kyc_dev_2024';
};

// Cliente Axios configurado
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000, // 30s para permitir llamadas a OpenAI
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: agregar token de autorización a todas las peticiones
apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAuthToken()}`;
  return config;
});

// Interceptor: manejo centralizado de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ mensaje?: string; codigo?: string }>) => {
    const mensaje =
      error.response?.data?.mensaje ||
      error.message ||
      'Error de conexión con el servidor';
    return Promise.reject(new Error(mensaje));
  }
);

// ============================================================
// Consulta de Cédula
// ============================================================

export interface ConsultaCedulaResultado {
  exito: boolean;
  datos?: DatosRegistroCivil;
  codigo?: string;
  mensaje?: string;
}

/**
 * Consulta una cédula en el Registro Civil.
 * Si falla, retorna exito: false para activar ingreso manual.
 */
export async function consultarCedula(numero: string): Promise<ConsultaCedulaResultado> {
  try {
    const response = await apiClient.get<{ exito: boolean; datos: DatosRegistroCivil }>(
      `/cedula/${numero}`
    );
    return response.data;
  } catch (error) {
    // Si el servicio no está disponible, permitir ingreso manual
    if (error instanceof Error) {
      return {
        exito: false,
        mensaje: error.message,
        codigo: 'REGISTRO_CIVIL_NO_DISPONIBLE',
      };
    }
    throw error;
  }
}

// ============================================================
// Inicializar KYC
// ============================================================

export interface IniciarKycParams {
  cedula: string;
  tipoPersona: TipoPersona;
  nombres: string;
  fechaNacimiento: string;
  estadoCivil: string;
  datosRegistroCivil?: DatosRegistroCivil;
  ingresoManual: boolean;
}

export async function iniciarKyc(params: IniciarKycParams): Promise<{ kycId: string }> {
  const response = await apiClient.post<{ exito: boolean; datos: { kycId: string } }>(
    '/kyc/init',
    params
  );
  return response.data.datos!;
}

// ============================================================
// Upload de Documento
// ============================================================

export interface UploadDocumentoParams {
  kycId: string;
  tipo: TipoDocumento;
  archivo: File;
}

export interface UploadDocumentoResultado {
  documentoId: string;
  kycId: string;
  tipo: TipoDocumento;
  nombreArchivo: string;
  mimeType: string;
}

export async function subirDocumento(params: UploadDocumentoParams): Promise<UploadDocumentoResultado> {
  const formData = new FormData();
  formData.append('archivo', params.archivo);
  formData.append('kycId', params.kycId);
  formData.append('tipo', params.tipo);

  const response = await apiClient.post<{ exito: boolean; datos: UploadDocumentoResultado }>(
    '/kyc/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60s para uploads
    }
  );

  return response.data.datos!;
}

// ============================================================
// Validación de Documento
// ============================================================

export interface ValidarDocumentoResultado {
  documentoId: string;
  validacion: ValidacionDocumentoRespuesta;
}

export async function validarDocumento(documentoId: string): Promise<ValidarDocumentoResultado> {
  try {
    const response = await apiClient.post<{ exito: boolean; datos: ValidarDocumentoResultado }>(
      '/kyc/validate-document',
      { documentoId },
      { timeout: 60000 } // OpenAI puede tardar hasta 60s
    );
    return response.data.datos!;
  } catch (error) {
    // Si la validación falla con 422, extraer los datos de validación
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      const data = error.response.data as { datos?: ValidarDocumentoResultado };
      if (data?.datos) {
        return data.datos;
      }
    }
    throw error;
  }
}

// ============================================================
// Envío al ERP
// ============================================================

export interface SubmitKycResultado {
  referencia: string;
  mensaje: string;
}

export async function enviarKyc(kycId: string): Promise<SubmitKycResultado> {
  const response = await apiClient.post<{ exito: boolean; datos: SubmitKycResultado }>(
    '/kyc/submit',
    { kycId }
  );
  return response.data.datos!;
}

// ============================================================
// Auditoría
// ============================================================

export async function obtenerAuditoria(kycId: string): Promise<Record<string, unknown>[]> {
  const response = await apiClient.get<{ datos: Record<string, unknown>[] }>(
    `/kyc/audit/${kycId}`
  );
  return response.data.datos;
}
