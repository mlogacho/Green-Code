// ============================================================
// Componente: Paso 5 - Confirmación exitosa
// ============================================================

import React from 'react';

interface SuccessStepProps {
  referencia: string;
  nombres: string;
  cedula: string;
  onNuevaSolicitud: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  referencia,
  nombres,
  cedula,
  onNuevaSolicitud,
}) => {
  const fechaActual = new Date().toLocaleDateString('es-EC', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="text-center space-y-6 py-4">
      {/* Icono de éxito */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          ¡Solicitud Enviada Exitosamente!
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          La solicitud KYC ha sido registrada en el sistema de Seguros Latina
        </p>
      </div>

      {/* Detalle */}
      <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 max-w-md mx-auto">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Número de referencia</span>
          <span className="font-mono font-medium text-primary-700 text-xs bg-primary-50 px-2 py-0.5 rounded">
            {referencia || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Cliente</span>
          <span className="font-medium text-gray-700 text-right max-w-[200px] truncate">{nombres}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Cédula</span>
          <span className="font-medium text-gray-700">{cedula}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Fecha de envío</span>
          <span className="font-medium text-gray-700 text-right text-xs capitalize">{fechaActual}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Estado</span>
          <span className="text-amber-600 font-medium text-xs bg-amber-50 px-2 py-0.5 rounded">En revisión</span>
        </div>
      </div>

      {/* Mensaje informativo */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 max-w-md mx-auto text-left">
        <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-blue-700">
          La solicitud será revisada por el equipo de Seguros Latina. Guarde el número de referencia para cualquier consulta futura.
        </p>
      </div>

      {/* Acciones */}
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={onNuevaSolicitud}
          className="px-6 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-medium"
        >
          Nueva Solicitud KYC
        </button>
      </div>
    </div>
  );
};

export default SuccessStep;
