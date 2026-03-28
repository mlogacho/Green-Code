// ============================================================
// Componente: Paso 4 - Revisión Final antes del envío
// ============================================================

import React, { useState } from 'react';
import { EstadoFormulario } from '../types';
import { enviarKyc } from '../services/api';
import { ETIQUETAS_DOCUMENTO } from '../utils/documentos';
import toast from 'react-hot-toast';

interface ReviewStepProps {
  estado: EstadoFormulario;
  onAnterior: () => void;
  onExito: (referencia: string) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ estado, onAnterior, onExito }) => {
  const [enviando, setEnviando] = useState(false);

  const handleEnviar = async () => {
    if (!estado.kycId) {
      toast.error('Error: No se encontró la solicitud KYC');
      return;
    }

    setEnviando(true);

    try {
      const resultado = await enviarKyc(estado.kycId);
      toast.success('¡Solicitud enviada exitosamente!');
      onExito(resultado.referencia);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar la solicitud');
    } finally {
      setEnviando(false);
    }
  };

  const documentosValidados = estado.documentos.filter((d) => d.validado);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Revisión de la Solicitud</h2>
        <p className="text-sm text-gray-500 mt-1">
          Verifique que todos los datos sean correctos antes de enviar
        </p>
      </div>

      {/* Datos del cliente */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Datos del Cliente
        </h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Cédula</p>
            <p className="font-medium text-gray-800">{estado.cedula}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Nombres</p>
            <p className="font-medium text-gray-800">{estado.nombres || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Fecha de Nacimiento</p>
            <p className="font-medium text-gray-800">
              {estado.fechaNacimiento
                ? new Date(estado.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-EC', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Estado Civil</p>
            <p className="font-medium text-gray-800">{estado.estadoCivil || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Tipo de Persona</p>
            <p className="font-medium text-gray-800">
              {estado.tipoPersona === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Origen de datos</p>
            <p className="font-medium text-gray-800">
              {estado.ingresoManual ? 'Ingreso manual' : 'Registro Civil'}
            </p>
          </div>
        </div>
      </div>

      {/* Documentos */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Documentos Validados ({documentosValidados.length})
        </h3>

        {documentosValidados.length === 0 ? (
          <p className="text-sm text-gray-500">No hay documentos validados</p>
        ) : (
          <div className="space-y-2">
            {documentosValidados.map((doc) => (
              <div
                key={doc.tipo}
                className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-green-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">
                      {ETIQUETAS_DOCUMENTO[doc.tipo] || doc.tipo}
                    </p>
                    {doc.archivo && (
                      <p className="text-xs text-gray-400">{doc.archivo.name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {doc.validacionRespuesta && (
                    <p className="text-xs text-green-600">
                      {(doc.validacionRespuesta.confianza * 100).toFixed(0)}% confianza
                    </p>
                  )}
                  {doc.validacionRespuesta?.advertencia && (
                    <p className="text-xs text-amber-500">Con advertencia</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Aviso de confirmación */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-amber-700">
          Al enviar esta solicitud, los datos serán registrados en el sistema de Seguros Latina. 
          Asegúrese de que toda la información sea correcta.
        </p>
      </div>

      {/* Navegación */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onAnterior}
          disabled={enviando}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          Anterior
        </button>
        <button
          onClick={handleEnviar}
          disabled={enviando}
          className="px-6 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
        >
          {enviando ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando...
            </>
          ) : (
            'Confirmar y Enviar'
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
