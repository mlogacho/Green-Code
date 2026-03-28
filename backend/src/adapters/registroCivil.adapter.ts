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
import logger from '../utils/logger';

/**
 * Interfaz del adaptador del Registro Civil.
 * Cualquier implementación (mock o real) debe cumplir este contrato.
 */
export interface IRegistroCivilAdapter {
  consultarCedula(cedula: string): Promise<DatosRegistroCivil>;
}

/**
 * Adaptador MOCK para desarrollo (v1).
 * Simula la respuesta del Registro Civil con datos de prueba.
 * Reemplazar con RealRegistroCivilAdapter en producción.
 */
export class MockRegistroCivilAdapter implements IRegistroCivilAdapter {
  // Base de datos mock de cédulas para pruebas
  private readonly mockData: Record<string, Omit<DatosRegistroCivil, 'cedula'>> = {
    '1712345678': {
      nombres: 'JUAN CARLOS PEREZ LOPEZ',
      fechaNacimiento: '1985-03-15',
      estadoCivil: 'CASADO',
    },
    '0912345678': {
      nombres: 'MARIA ELENA RODRIGUEZ TORRES',
      fechaNacimiento: '1990-07-22',
      estadoCivil: 'SOLTERA',
    },
    '1709876543': {
      nombres: 'CARLOS ANDRES GOMEZ VARGAS',
      fechaNacimiento: '1978-11-30',
      estadoCivil: 'DIVORCIADO',
    },
  };

  async consultarCedula(cedula: string): Promise<DatosRegistroCivil> {
    logger.debug('MockRegistroCivil: consultando cédula', { cedula });

    // Simular latencia de red (200-500ms)
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

    const datosConocidos = this.mockData[cedula];

    if (datosConocidos) {
      return {
        cedula,
        ...datosConocidos,
        fuenteDatos: 'mock',
      };
    }

    // Para cédulas no registradas en el mock, devolver datos genéricos
    return {
      cedula,
      nombres: 'NOMBRE APELLIDO EJEMPLO',
      fechaNacimiento: '1990-01-01',
      estadoCivil: 'SOLTERO',
      fuenteDatos: 'mock',
    };
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
