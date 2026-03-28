// ============================================================
// Servicio de consulta al Registro Civil
// Usa el adaptador configurado para consultar datos de la cédula
// ============================================================

import { DatosRegistroCivil } from '../types';
import { crearRegistroCivilAdapter } from '../adapters/registroCivil.adapter';
import logger from '../utils/logger';

// Instancia única del adaptador (singleton)
const adapter = crearRegistroCivilAdapter();

/**
 * Valida el formato de una cédula ecuatoriana (10 dígitos + algoritmo).
 */
export function validarCedula(cedula: string): boolean {
  if (!/^\d{10}$/.test(cedula)) return false;

  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || (provincia > 24 && provincia !== 30)) return false;

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i], 10) * coeficientes[i];
    if (valor >= 10) valor -= 9;
    suma += valor;
  }

  const digitoVerificador = parseInt(cedula[9], 10);
  const residuo = suma % 10;
  const calculado = residuo === 0 ? 0 : 10 - residuo;

  return digitoVerificador === calculado;
}

/**
 * Consulta los datos de una cédula en el Registro Civil.
 * Lanza un error si la consulta falla.
 */
export async function consultarCedula(cedula: string): Promise<DatosRegistroCivil> {
  logger.info('Consultando cédula en Registro Civil', { cedula });

  const datos = await adapter.consultarCedula(cedula);

  logger.info('Cédula consultada exitosamente', {
    cedula,
    fuenteDatos: datos.fuenteDatos,
  });

  return datos;
}
