// ============================================================
// Adaptador del ERP de Seguros Latina
//
// Patrón Adapter: permite integrar el ERP real sin modificar
// el resto del sistema.
//
// En v1 se usa el MockErpAdapter.
// Para producción, implementar RealErpAdapter.
// ============================================================

import { ErpPayload, ErpRespuesta } from '../types';
import logger from '../utils/logger';

/**
 * Interfaz del adaptador ERP.
 * Cualquier implementación debe cumplir este contrato.
 */
export interface IErpAdapter {
  enviarKyc(payload: ErpPayload): Promise<ErpRespuesta>;
}

/**
 * Adaptador MOCK para desarrollo (v1).
 * Simula el envío al ERP y retorna una respuesta exitosa.
 * Reemplazar con RealErpAdapter cuando se tenga el ERP real.
 */
export class MockErpAdapter implements IErpAdapter {
  async enviarKyc(payload: ErpPayload): Promise<ErpRespuesta> {
    logger.debug('MockErp: enviando KYC', { kyc_id: payload.kyc_id });

    // Simular latencia de red del ERP (500ms - 1s)
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    // Simular 95% de éxito
    if (Math.random() < 0.95) {
      const referencia = `ERP-${Date.now()}-${payload.cedula.slice(-4)}`;
      logger.info('MockErp: KYC enviado exitosamente', {
        kyc_id: payload.kyc_id,
        referencia,
      });

      return {
        exito: true,
        mensaje: 'KYC registrado exitosamente en el sistema',
        referencia,
        datos: {
          estado: 'en_revision',
          fecha_recepcion: new Date().toISOString(),
        },
      };
    }

    // Simular fallo ocasional para pruebas
    throw new Error('Error simulado del ERP: servicio no disponible');
  }
}

/**
 * Adaptador REAL para producción.
 * Llama a la API del ERP de Seguros Latina.
 * Implementar cuando se tengan los detalles del ERP.
 */
export class RealErpAdapter implements IErpAdapter {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async enviarKyc(payload: ErpPayload): Promise<ErpRespuesta> {
    logger.info('RealErp: enviando KYC', { kyc_id: payload.kyc_id });

    // TODO: Implementar la llamada real al ERP de Seguros Latina
    // Ejemplo de implementación:
    //
    // const response = await fetch(`${this.apiUrl}/kyc/submit`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(payload),
    // });
    //
    // if (!response.ok) {
    //   const error = await response.text();
    //   throw new Error(`Error en ERP: ${response.status} - ${error}`);
    // }
    //
    // const data = await response.json();
    // return {
    //   exito: true,
    //   mensaje: data.mensaje,
    //   referencia: data.referencia,
    //   datos: data,
    // };

    throw new Error('RealErpAdapter no implementado. Use MockErpAdapter en desarrollo.');
  }
}

/**
 * Factory: retorna el adaptador correcto según el entorno.
 */
export function crearErpAdapter(): IErpAdapter {
  if (process.env.NODE_ENV === 'production' && process.env.ERP_API_KEY) {
    logger.info('Usando RealErpAdapter');
    return new RealErpAdapter(
      process.env.ERP_API_URL!,
      process.env.ERP_API_KEY!
    );
  }

  logger.info('Usando MockErpAdapter (desarrollo)');
  return new MockErpAdapter();
}
