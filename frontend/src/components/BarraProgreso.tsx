// ============================================================
// Componente: Barra de Progreso del Wizard KYC
// ============================================================

import React from 'react';

interface Paso {
  numero: number;
  etiqueta: string;
}

interface BarraProgresoProps {
  pasoActual: number;
  pasos: Paso[];
}

const BarraProgreso: React.FC<BarraProgresoProps> = ({ pasoActual, pasos }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Línea de conexión entre pasos */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div
            className="h-full bg-primary-600 transition-all duration-500 ease-in-out"
            style={{ width: `${((pasoActual - 1) / (pasos.length - 1)) * 100}%` }}
          />
        </div>

        {pasos.map((paso) => {
          const completado = paso.numero < pasoActual;
          const activo = paso.numero === pasoActual;

          return (
            <div key={paso.numero} className="flex flex-col items-center z-10">
              {/* Círculo del paso */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-sm font-semibold border-2 transition-all duration-300
                  ${completado
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : activo
                    ? 'bg-white border-primary-600 text-primary-600'
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}
              >
                {completado ? (
                  // Check icon para pasos completados
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  paso.numero
                )}
              </div>

              {/* Etiqueta del paso */}
              <span
                className={`
                  mt-2 text-xs font-medium text-center max-w-[80px] leading-tight
                  ${activo ? 'text-primary-700' : completado ? 'text-primary-600' : 'text-gray-400'}
                `}
              >
                {paso.etiqueta}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarraProgreso;
