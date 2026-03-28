// ============================================================
// Componente: Upload individual de documento con validación
// ============================================================

import React, { useRef, useState } from 'react';
import { EstadoDocumento, DefinicionDocumento } from '../types';
import { validarArchivo, formatearTamano } from '../utils/documentos';

interface DocumentUploadProps {
  definicion: DefinicionDocumento;
  estado: EstadoDocumento;
  onArchivoSeleccionado: (archivo: File) => void;
  onValidar: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  definicion,
  estado,
  onArchivoSeleccionado,
  onValidar,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState('');

  const handleArchivoChange = (archivos: FileList | null) => {
    if (!archivos || archivos.length === 0) return;
    const archivo = archivos[0];

    const validacion = validarArchivo(archivo);
    if (!validacion.valido) {
      setErrorArchivo(validacion.error || 'Archivo inválido');
      return;
    }

    setErrorArchivo('');
    onArchivoSeleccionado(archivo);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    handleArchivoChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const handleDragLeave = () => {
    setArrastrando(false);
  };

  // Determinar el estado visual del componente
  const tieneArchivo = !!estado.archivo;
  const estaSubiendo = estado.subiendo;
  const estaValidando = estado.validando;
  const estaValidado = estado.validado;
  const validacionFalló = estado.validacionRespuesta && !estado.validacionRespuesta.valido;
  const hayAdvertencia = estado.validacionRespuesta?.advertencia;

  return (
    <div className={`
      border rounded-xl p-4 transition-all duration-200
      ${estaValidado && !validacionFalló ? 'border-green-300 bg-green-50' : ''}
      ${validacionFalló ? 'border-red-300 bg-red-50' : ''}
      ${!estaValidado && !validacionFalló ? 'border-gray-200 bg-white' : ''}
    `}>
      {/* Cabecera */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm text-gray-800">{definicion.etiqueta}</h4>
            {definicion.requerido && (
              <span className="text-red-500 text-xs">*</span>
            )}
            {!definicion.requerido && (
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Opcional</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{definicion.descripcion}</p>
        </div>

        {/* Indicador de estado */}
        {estaValidado && !validacionFalló && (
          <div className="flex items-center gap-1 text-green-600 shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Validado</span>
          </div>
        )}
        {validacionFalló && (
          <div className="flex items-center gap-1 text-red-600 shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Inválido</span>
          </div>
        )}
      </div>

      {/* Zona de drop / archivo seleccionado */}
      {!tieneArchivo ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${arrastrando ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'}
          `}
        >
          <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-xs text-gray-600">
            Arrastre el archivo aquí o{' '}
            <span className="text-primary-600 font-medium">haga clic para seleccionar</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG o PDF · Máximo 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleArchivoChange(e.target.files)}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Archivo seleccionado */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center shrink-0">
              {estado.archivo!.type === 'application/pdf' ? (
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-700 truncate">{estado.archivo!.name}</p>
              <p className="text-xs text-gray-400">{formatearTamano(estado.archivo!.size)}</p>
            </div>
            {!estaSubiendo && !estaValidando && !estaValidado && (
              <button
                onClick={() => inputRef.current?.click()}
                className="text-xs text-gray-400 hover:text-gray-600 shrink-0"
                title="Cambiar archivo"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleArchivoChange(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Estado de carga */}
          {estaSubiendo && (
            <div className="flex items-center gap-2 text-primary-600 text-xs">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Subiendo documento...
            </div>
          )}

          {estaValidando && (
            <div className="flex items-center gap-2 text-primary-600 text-xs">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Validando con IA... (puede tardar unos segundos)
            </div>
          )}

          {/* Resultado de validación */}
          {estado.validacionRespuesta && (
            <div className={`rounded-lg p-3 text-xs ${
              estado.validacionRespuesta.valido
                ? hayAdvertencia ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${
                estado.validacionRespuesta.valido
                  ? hayAdvertencia ? 'text-amber-700' : 'text-green-700'
                  : 'text-red-700'
              }`}>
                {estado.validacionRespuesta.valido
                  ? hayAdvertencia ? 'Documento validado con advertencia' : 'Documento válido'
                  : 'Documento no válido'}
              </p>
              <p className={`mt-0.5 ${
                estado.validacionRespuesta.valido
                  ? hayAdvertencia ? 'text-amber-600' : 'text-green-600'
                  : 'text-red-600'
              }`}>
                {hayAdvertencia || estado.validacionRespuesta.motivo}
              </p>
              <div className="mt-1 flex items-center gap-1 text-gray-500">
                <span>Confianza: </span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[100px]">
                  <div
                    className={`h-full rounded-full ${
                      estado.validacionRespuesta.confianza >= 0.7
                        ? 'bg-green-500'
                        : estado.validacionRespuesta.confianza >= 0.4
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(estado.validacionRespuesta.confianza * 100).toFixed(0)}%` }}
                  />
                </div>
                <span>{(estado.validacionRespuesta.confianza * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}

          {/* Error del componente */}
          {estado.error && (
            <p className="text-xs text-red-600">{estado.error}</p>
          )}

          {/* Botón validar */}
          {!estaValidado && estado.documentoId && !estaValidando && (
            <button
              onClick={onValidar}
              disabled={estaSubiendo || estaValidando}
              className="w-full py-2 px-4 bg-primary-700 text-white text-xs font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 transition-colors"
            >
              Validar Documento
            </button>
          )}

          {/* Re-validar si falló */}
          {validacionFalló && !estaValidando && (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full py-2 px-4 border border-red-300 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Cambiar documento e intentar de nuevo
            </button>
          )}
        </div>
      )}

      {/* Error de archivo */}
      {errorArchivo && (
        <p className="text-xs text-red-600 mt-2">{errorArchivo}</p>
      )}
    </div>
  );
};

export default DocumentUpload;
