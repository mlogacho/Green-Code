// ============================================================
// Servicio de validación de documentos con OpenAI GPT-4o Vision
// ============================================================

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { TipoDocumento, ValidacionDocumentoRespuesta } from '../types';
import logger from '../utils/logger';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================
// Prompts específicos por tipo de documento (en español)
// ============================================================
const PROMPTS_VALIDACION: Record<TipoDocumento, string> = {
  cedula:
    'Analiza esta imagen. ¿Es una cédula de identidad ecuatoriana válida? Verifica que tenga: número de cédula de 10 dígitos, nombres y apellidos, fecha de nacimiento, y el logo del Registro Civil de Ecuador. Responde con JSON: {"valido": boolean, "motivo": string, "confianza": number}',

  servicio_basico:
    'Analiza esta imagen. ¿Es un comprobante de servicio básico ecuatoriano (agua, luz, teléfono, internet)? Verifica que tenga: dirección, nombre del titular, período de facturación y valor. Responde con JSON: {"valido": boolean, "motivo": string, "confianza": number}',

  cedula_conyuge:
    'Analiza esta imagen. ¿Es una cédula de identidad ecuatoriana válida? Verifica que tenga: número de cédula de 10 dígitos, nombres y apellidos, fecha de nacimiento, y el logo del Registro Civil de Ecuador. Responde con JSON: {"valido": boolean, "motivo": string, "confianza": number}',

  ruc:
    'Analiza esta imagen. ¿Es un documento RUC (Registro Único de Contribuyentes) del SRI de Ecuador válido? Verifica número RUC de 13 dígitos, razón social, actividad económica y estado del contribuyente. Responde con JSON: {"valido": boolean, "motivo": string, "confianza": number}',

  cedula_representante:
    'Analiza esta imagen. ¿Es una cédula de identidad ecuatoriana válida del representante legal? Verifica que tenga: número de cédula de 10 dígitos, nombres y apellidos, fecha de nacimiento, y el logo del Registro Civil de Ecuador. Responde con JSON: {"valido": boolean, "motivo": string, "confianza": number}',

  nombramiento:
    'Analiza esta imagen. ¿Es un documento de nombramiento de representante legal válido en Ecuador? Debe tener: nombre de la empresa, nombre del representante legal, cargo, fecha de nombramiento y firmas/sellos. Responde con JSON: {"valido": boolean, "motivo": string, "confianza": number}',

  balances:
    'Analiza esta imagen. ¿Es un balance o estado financiero empresarial ecuatoriano? Debe contener: nombre de empresa, período contable, activos, pasivos y patrimonio. Responde con JSON: {"valido": boolean, "motivo": string, "confianza": number}',
};

/**
 * Convierte un archivo a base64 para enviarlo a OpenAI.
 */
function archivoABase64(rutaArchivo: string): string {
  const buffer = fs.readFileSync(rutaArchivo);
  return buffer.toString('base64');
}

/**
 * Determina el tipo MIME para la URL de datos de OpenAI.
 */
function obtenerMimeType(mimeType: string): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
  const tipos: Record<string, 'image/jpeg' | 'image/png'> = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
  };
  return tipos[mimeType] || 'image/jpeg';
}

/**
 * Extrae y parsea el JSON de la respuesta de OpenAI.
 * Maneja casos donde el modelo incluye texto extra alrededor del JSON.
 */
function parsearRespuestaOpenAI(contenido: string): { valido: boolean; motivo: string; confianza: number } {
  // Intentar parsear directamente
  try {
    return JSON.parse(contenido);
  } catch {
    // Buscar JSON en el contenido
    const match = contenido.match(/\{[\s\S]*"valido"[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // fallthrough
      }
    }
    // Si no se puede parsear, asumir inválido
    logger.warn('No se pudo parsear respuesta de OpenAI', { contenido });
    return {
      valido: false,
      motivo: 'No se pudo analizar el documento correctamente',
      confianza: 0,
    };
  }
}

/**
 * Valida un documento usando OpenAI GPT-4o Vision.
 * Para archivos PDF convierte solo si es imagen; para PDFs devuelve validación manual.
 */
export async function validarDocumento(
  rutaArchivo: string,
  tipoDocumento: TipoDocumento,
  mimeType: string
): Promise<ValidacionDocumentoRespuesta> {
  logger.info('Validando documento con OpenAI', { tipoDocumento, mimeType });

  // Para archivos PDF, OpenAI Vision no puede procesarlos directamente
  // En producción se podría usar pdf-to-image, por ahora retornamos una advertencia
  if (mimeType === 'application/pdf') {
    logger.warn('PDF recibido - validación limitada', { tipoDocumento });
    return {
      valido: true,
      motivo: 'Documento PDF recibido. Validación visual no disponible para PDFs. Revisar manualmente.',
      confianza: 0.5,
      advertencia: 'Documento PDF: la validación automática está limitada. Se requiere revisión manual.',
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    logger.warn('OPENAI_API_KEY no configurada, usando validación mock');
    return {
      valido: true,
      motivo: 'Validación mock: OpenAI no configurado en este entorno',
      confianza: 0.5,
      advertencia: 'Modo desarrollo: OpenAI no está configurado. Configure OPENAI_API_KEY para validación real.',
    };
  }

  const imagenBase64 = archivoABase64(rutaArchivo);
  const tipoMime = obtenerMimeType(mimeType);
  const prompt = PROMPTS_VALIDACION[tipoDocumento];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${tipoMime};base64,${imagenBase64}`,
              detail: 'high',
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const contenido = response.choices[0]?.message?.content || '{}';
  const resultado = parsearRespuestaOpenAI(contenido);

  logger.info('Validación OpenAI completada', {
    tipoDocumento,
    valido: resultado.valido,
    confianza: resultado.confianza,
  });

  // Si la confianza es baja pero el documento es válido, agregar advertencia
  const advertencia =
    resultado.valido && resultado.confianza < 0.7
      ? 'La confianza de validación es baja. Se recomienda revisión manual.'
      : undefined;

  return {
    ...resultado,
    advertencia,
  };
}
