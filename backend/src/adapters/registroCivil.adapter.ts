// ============================================================
// Adaptador del Registro Civil de Ecuador
//
// Patrón Adapter: permite cambiar la implementación real
// sin modificar el resto del código.
//
// En v1 se usa el MockRegistroCivilAdapter.
// Para producción, implementar RealRegistroCivilAdapter.
// ============================================================

import { DatosRegistroCivil } from '../types';
import { buscarCedulaDemo } from '../data/demoCedulas';
import logger from '../utils/logger';

/**
 * Interfaz del adaptador del Registro Civil.
 * Cualquier implementación (mock o real) debe cumplir este contrato.
 */
export interface IRegistroCivilAdapter {
  consultarCedula(cedula: string): Promise<DatosRegistroCivil>;
}

/**
 * Adaptador MOCK para demo (v1).
 * Consulta la base de datos demo de 50 registros con cédulas ecuatorianas válidas.
 * Reemplazar con RealRegistroCivilAdapter en producción.
 */
export class MockRegistroCivilAdapter implements IRegistroCivilAdapter {
  async consultarCedula(cedula: string): Promise<DatosRegistroCivil> {
    logger.debug('MockRegistroCivil: consultando cédula en base demo', { cedula });

    // Simular latencia de red (300-700ms)
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400));

    const registro = buscarCedulaDemo(cedula);

    if (registro) {
      return {
        cedula,
        nombres: registro.nombres,
        fechaNacimiento: registro.fechaNacimiento,
        estadoCivil: registro.estadoCivil,
        fuenteDatos: 'mock',
      };
    }

    // Cédula no encontrada en la base demo → el frontend mostrará ingreso manual
    throw new Error(`Cédula ${cedula} no encontrada en el Registro Civil`);
  }
}

/**
 * Adaptador REAL para producción.
 * Llama a la API oficial del Registro Civil de Ecuador.
 * Implementar cuando se tengan las credenciales reales.
 */
export class RealRegistroCivilAdapter implements IRegistroCivilAdapter {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async consultarCedula(cedula: string): Promise<DatosRegistroCivil> {
    logger.info('RealRegistroCivil: consultando cédula', { cedula });

    // TODO: Implementar la llamada real a la API del Registro Civil
    // Ejemplo de implementación:
    //
    // const response = await fetch(`${this.apiUrl}/personas/${cedula}`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`Error consultando Registro Civil: ${response.status}`);
    // }
    //
    // const data = await response.json();
    // return {
    //   cedula,
    //   nombres: data.nombres,
    //   fechaNacimiento: data.fecha_nacimiento,
    //   estadoCivil: data.estado_civil,
    //   fuenteDatos: 'api',
    // };

    throw new Error('RealRegistroCivilAdapter no implementado. Use MockRegistroCivilAdapter en desarrollo.');
  }
}

/**
 * Factory: retorna el adaptador correcto según el entorno.
 * En desarrollo: Mock. En producción: Real (cuando esté implementado).
 */
export function crearRegistroCivilAdapter(): IRegistroCivilAdapter {
  if (process.env.NODE_ENV === 'production' && process.env.REGISTRO_CIVIL_API_KEY) {
    logger.info('Usando RealRegistroCivilAdapter');
    return new RealRegistroCivilAdapter(
      process.env.REGISTRO_CIVIL_API_URL!,
      process.env.REGISTRO_CIVIL_API_KEY!
    );
  }

  logger.info('Usando MockRegistroCivilAdapter (desarrollo)');
  return new MockRegistroCivilAdapter();
}
