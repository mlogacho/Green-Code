// ============================================================
// Componente: Paso 2 - Selección de Tipo de Persona
// ============================================================

import React from 'react';
import { TipoPersona } from '../types';

interface PersonTypeStepProps {
  tipoPersona?: TipoPersona;
  onSeleccionar: (tipo: TipoPersona) => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}

const PersonTypeStep: React.FC<PersonTypeStepProps> = ({
  tipoPersona,
  onSeleccionar,
  onAnterior,
  onSiguiente,
}) => {
  const handleSiguiente = () => {
    if (!tipoPersona) return;
    onSiguiente();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Tipo de Persona</h2>
        <p className="text-sm text-gray-500 mt-1">
          Seleccione el tipo de persona para determinar los documentos requeridos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Persona Natural */}
        <button
          onClick={() => onSeleccionar('natural')}
          className={`
            relative p-6 rounded-xl border-2 text-left transition-all duration-200
            ${tipoPersona === 'natural'
              ? 'border-primary-600 bg-primary-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
            }
          `}
        >
          {tipoPersona === 'natural' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          <div className="flex flex-col items-start gap-3">
            {/* Icono */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tipoPersona === 'natural' ? 'bg-primary-100' : 'bg-gray-100'}`}>
              <svg className={`w-6 h-6 ${tipoPersona === 'natural' ? 'text-primary-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div>
              <h3 className={`font-semibold text-base ${tipoPersona === 'natural' ? 'text-primary-700' : 'text-gray-700'}`}>
                Persona Natural
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Para personas físicas. Requiere cédula, servicio básico y cédula del cónyuge (si aplica).
              </p>
            </div>

            <div className="w-full space-y-1 mt-1">
              <p className="text-xs font-medium text-gray-600">Documentos requeridos:</p>
              {['Copia de Cédula', 'Comprobante de Servicio Básico', 'Cédula del Cónyuge (si está casado/a)'].map((doc) => (
                <div key={doc} className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${tipoPersona === 'natural' ? 'bg-primary-500' : 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-500">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </button>

        {/* Persona Jurídica */}
        <button
          onClick={() => onSeleccionar('juridica')}
          className={`
            relative p-6 rounded-xl border-2 text-left transition-all duration-200
            ${tipoPersona === 'juridica'
              ? 'border-primary-600 bg-primary-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
            }
          `}
        >
          {tipoPersona === 'juridica' && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          <div className="flex flex-col items-start gap-3">
            {/* Icono */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tipoPersona === 'juridica' ? 'bg-primary-100' : 'bg-gray-100'}`}>
              <svg className={`w-6 h-6 ${tipoPersona === 'juridica' ? 'text-primary-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <div>
              <h3 className={`font-semibold text-base ${tipoPersona === 'juridica' ? 'text-primary-700' : 'text-gray-700'}`}>
                Persona Jurídica
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Para empresas y organizaciones. Requiere RUC, cédula del representante, nombramiento y balances.
              </p>
            </div>

            <div className="w-full space-y-1 mt-1">
              <p className="text-xs font-medium text-gray-600">Documentos requeridos:</p>
              {['Copia del RUC', 'Cédula del Representante Legal', 'Nombramiento del Representante', 'Balances de la Empresa'].map((doc) => (
                <div key={doc} className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${tipoPersona === 'juridica' ? 'bg-primary-500' : 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-500">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </button>
      </div>

      {/* Navegación */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onAnterior}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Anterior
        </button>
        <button
          onClick={handleSiguiente}
          disabled={!tipoPersona}
          className="px-6 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PersonTypeStep;
