// ============================================================
// Componente: Paso 1 - Ingreso y Consulta de Cédula
// ============================================================

import React, { useState } from 'react';
import { consultarCedula } from '../services/api';
import { DatosRegistroCivil } from '../types';
import toast from 'react-hot-toast';

interface CedulaStepProps {
  cedula: string;
  datosRegistroCivil?: DatosRegistroCivil;
  ingresoManual: boolean;
  nombres: string;
  fechaNacimiento: string;
  estadoCivil: string;
  onDatosObtenidos: (datos: {
    cedula: string;
    datosRegistroCivil?: DatosRegistroCivil;
    ingresoManual: boolean;
    nombres: string;
    fechaNacimiento: string;
    estadoCivil: string;
  }) => void;
  onSiguiente: () => void;
}

const ESTADOS_CIVILES = [
  { valor: 'SOLTERO', etiqueta: 'Soltero/a' },
  { valor: 'CASADO', etiqueta: 'Casado/a' },
  { valor: 'DIVORCIADO', etiqueta: 'Divorciado/a' },
  { valor: 'VIUDO', etiqueta: 'Viudo/a' },
  { valor: 'UNION_LIBRE', etiqueta: 'Unión Libre' },
];

const CedulaStep: React.FC<CedulaStepProps> = ({
  cedula,
  datosRegistroCivil,
  ingresoManual,
  nombres,
  fechaNacimiento,
  estadoCivil,
  onDatosObtenidos,
  onSiguiente,
}) => {
  const [cedulaInput, setCedulaInput] = useState(cedula);
  const [consultando, setConsultando] = useState(false);
  const [error, setError] = useState('');

  // Estado local para el formulario manual
  const [nombresManual, setNombresManual] = useState(nombres);
  const [fechaNacimientoManual, setFechaNacimientoManual] = useState(fechaNacimiento);
  const [estadoCivilManual, setEstadoCivilManual] = useState(estadoCivil || 'SOLTERO');

  const handleConsultarCedula = async () => {
    setError('');

    if (!cedulaInput || cedulaInput.length !== 10) {
      setError('Ingrese un número de cédula válido de 10 dígitos');
      return;
    }

    setConsultando(true);

    try {
      const resultado = await consultarCedula(cedulaInput);

      if (resultado.exito && resultado.datos) {
        const datos = resultado.datos;
        onDatosObtenidos({
          cedula: cedulaInput,
          datosRegistroCivil: datos,
          ingresoManual: false,
          nombres: datos.nombres,
          fechaNacimiento: datos.fechaNacimiento,
          estadoCivil: datos.estadoCivil,
        });
        toast.success('Datos obtenidos del Registro Civil');
      } else {
        // Registro Civil no disponible → activar ingreso manual
        toast('El Registro Civil no está disponible. Complete los datos manualmente.', {
          icon: 'ℹ️',
        });
        onDatosObtenidos({
          cedula: cedulaInput,
          ingresoManual: true,
          nombres: '',
          fechaNacimiento: '',
          estadoCivil: 'SOLTERO',
        });
      }
    } catch {
      toast.error('Error consultando el Registro Civil');
      onDatosObtenidos({
        cedula: cedulaInput,
        ingresoManual: true,
        nombres: '',
        fechaNacimiento: '',
        estadoCivil: 'SOLTERO',
      });
    } finally {
      setConsultando(false);
    }
  };

  const handleSiguiente = () => {
    if (!cedula) {
      setError('Debe consultar una cédula antes de continuar');
      return;
    }

    if (ingresoManual) {
      if (!nombresManual.trim()) {
        setError('El nombre completo es requerido');
        return;
      }
      if (!fechaNacimientoManual) {
        setError('La fecha de nacimiento es requerida');
        return;
      }
      // Actualizar datos manuales
      onDatosObtenidos({
        cedula,
        ingresoManual: true,
        nombres: nombresManual,
        fechaNacimiento: fechaNacimientoManual,
        estadoCivil: estadoCivilManual,
      });
    }

    onSiguiente();
  };

  const handleNuevaBusqueda = () => {
    setCedulaInput('');
    setError('');
    onDatosObtenidos({
      cedula: '',
      ingresoManual: false,
      nombres: '',
      fechaNacimiento: '',
      estadoCivil: '',
    });
  };

  const datosConfirmados = cedula && (datosRegistroCivil || ingresoManual);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Identificación del Cliente</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ingrese el número de cédula para consultar los datos en el Registro Civil
        </p>
      </div>

      {/* Búsqueda de cédula */}
      {!datosConfirmados && (
        <div className="space-y-4">
          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Cédula
            </label>
            <div className="flex gap-3">
              <input
                id="cedula"
                type="text"
                value={cedulaInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setCedulaInput(val);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleConsultarCedula()}
                placeholder="Ej: 1712345678"
                maxLength={10}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={consultando}
              />
              <button
                onClick={handleConsultarCedula}
                disabled={consultando || cedulaInput.length !== 10}
                className="px-5 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
              >
                {consultando ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Consultando...
                  </>
                ) : (
                  'Consultar'
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>
      )}

      {/* Datos obtenidos del Registro Civil */}
      {datosConfirmados && !ingresoManual && datosRegistroCivil && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm">Datos obtenidos del Registro Civil</span>
            </div>
            <button
              onClick={handleNuevaBusqueda}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Cambiar cédula
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Cédula</p>
              <p className="font-medium text-gray-800">{datosRegistroCivil.cedula}</p>
            </div>
            <div>
              <p className="text-gray-500">Nombres</p>
              <p className="font-medium text-gray-800">{datosRegistroCivil.nombres}</p>
            </div>
            <div>
              <p className="text-gray-500">Fecha de Nacimiento</p>
              <p className="font-medium text-gray-800">
                {new Date(datosRegistroCivil.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-EC', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Estado Civil</p>
              <p className="font-medium text-gray-800">{datosRegistroCivil.estadoCivil}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de ingreso manual */}
      {datosConfirmados && ingresoManual && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm">Ingreso manual de datos</span>
            </div>
            <button
              onClick={handleNuevaBusqueda}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Intentar de nuevo
            </button>
          </div>

          <p className="text-xs text-amber-600">
            El Registro Civil no está disponible. Complete los datos manualmente.
          </p>

          <div className="text-sm text-gray-600 bg-amber-100 rounded px-3 py-1.5 font-medium">
            Cédula: {cedula}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres y Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombresManual}
                onChange={(e) => setNombresManual(e.target.value.toUpperCase())}
                placeholder="Ej: JUAN CARLOS PEREZ LOPEZ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={fechaNacimientoManual}
                onChange={(e) => setFechaNacimientoManual(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Civil <span className="text-red-500">*</span>
              </label>
              <select
                value={estadoCivilManual}
                onChange={(e) => setEstadoCivilManual(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                {ESTADOS_CIVILES.map((ec) => (
                  <option key={ec.valor} value={ec.valor}>{ec.etiqueta}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {error && datosConfirmados && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Botón continuar */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSiguiente}
          disabled={!datosConfirmados}
          className="px-6 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default CedulaStep;
