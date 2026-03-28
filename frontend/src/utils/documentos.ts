// ============================================================
// Utilidades para definición de documentos requeridos por tipo de persona
// ============================================================

import { DefinicionDocumento, TipoPersona } from '../types';

/**
 * Documentos requeridos para Persona Natural.
 * Si el titular es casado/a, se agrega la cédula del cónyuge.
 */
export const DOCUMENTOS_NATURAL: DefinicionDocumento[] = [
  {
    tipo: 'cedula',
    etiqueta: 'Copia de Cédula',
    descripcion: 'Copia de la cédula de identidad del titular (ambas caras)',
    requerido: true,
  },
  {
    tipo: 'servicio_basico',
    etiqueta: 'Comprobante de Servicio Básico',
    descripcion: 'Factura reciente de agua, luz, teléfono o internet (máximo 3 meses)',
    requerido: true,
  },
  {
    tipo: 'cedula_conyuge',
    etiqueta: 'Copia de Cédula del Cónyuge',
    descripcion: 'Copia de la cédula de identidad del cónyuge (ambas caras)',
    requerido: false,
    condicion: (estadoCivil: string) =>
      ['CASADO', 'CASADA', 'UNION_LIBRE'].includes(estadoCivil.toUpperCase()),
  },
];

/**
 * Documentos requeridos para Persona Jurídica.
 */
export const DOCUMENTOS_JURIDICA: DefinicionDocumento[] = [
  {
    tipo: 'ruc',
    etiqueta: 'Copia del RUC',
    descripcion: 'Registro Único de Contribuyentes de la empresa (estado activo)',
    requerido: true,
  },
  {
    tipo: 'cedula_representante',
    etiqueta: 'Cédula del Representante Legal',
    descripcion: 'Copia de la cédula del representante legal (ambas caras)',
    requerido: true,
  },
  {
    tipo: 'nombramiento',
    etiqueta: 'Nombramiento del Representante Legal',
    descripcion: 'Documento de nombramiento vigente del representante legal',
    requerido: true,
  },
  {
    tipo: 'balances',
    etiqueta: 'Balances de la Empresa',
    descripcion: 'Estados financieros del último período contable',
    requerido: true,
  },
];

/**
 * Obtiene los documentos requeridos según el tipo de persona y estado civil.
 */
export function obtenerDocumentosRequeridos(
  tipoPersona: TipoPersona,
  estadoCivil: string
): DefinicionDocumento[] {
  const base = tipoPersona === 'natural' ? DOCUMENTOS_NATURAL : DOCUMENTOS_JURIDICA;

  return base.filter((doc) => {
    if (doc.condicion) {
      return doc.condicion(estadoCivil);
    }
    return true;
  });
}

/**
 * Etiquetas legibles para cada tipo de documento.
 */
export const ETIQUETAS_DOCUMENTO: Record<string, string> = {
  cedula: 'Cédula de Identidad',
  servicio_basico: 'Servicio Básico',
  cedula_conyuge: 'Cédula del Cónyuge',
  ruc: 'RUC Empresa',
  cedula_representante: 'Cédula Representante Legal',
  nombramiento: 'Nombramiento Representante',
  balances: 'Balances Empresariales',
};

/**
 * Valida el tamaño y tipo de un archivo antes de subirlo.
 */
export function validarArchivo(archivo: File): { valido: boolean; error?: string } {
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const tamanoMaximoMB = 10;

  if (!tiposPermitidos.includes(archivo.type)) {
    return {
      valido: false,
      error: 'Tipo de archivo no permitido. Use JPG, PNG o PDF.',
    };
  }

  if (archivo.size > tamanoMaximoMB * 1024 * 1024) {
    return {
      valido: false,
      error: `El archivo supera el tamaño máximo de ${tamanoMaximoMB}MB.`,
    };
  }

  return { valido: true };
}

/**
 * Formatea el tamaño de un archivo en unidades legibles.
 */
export function formatearTamano(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
