// ============================================================
// Componente: Paso 3 - Carga y Validación de Documentos
// ============================================================

import React, { useEffect, useState } from 'react';
import { EstadoDocumento, TipoPersona, TipoDocumento, DefinicionDocumento } from '../types';
import { subirDocumento, validarDocumento } from '../services/api';
import { obtenerDocumentosRequeridos } from '../utils/documentos';
import DocumentUpload from './DocumentUpload';
import toast from 'react-hot-toast';

interface DocumentsStepProps {
  kycId: string;
  tipoPersona: TipoPersona;
  estadoCivil: string;
  documentos: EstadoDocumento[];
  onDocumentosActualizados: (documentos: EstadoDocumento[]) => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({
  kycId,
  tipoPersona,
  estadoCivil,
  documentos,
  onDocumentosActualizados,
  onAnterior,
  onSiguiente,
}) => {
  const [definiciones, setDefiniciones] = useState<DefinicionDocumento[]>([]);

  // Cargar definiciones de documentos según tipo de persona y estado civil
  useEffect(() => {
    const defs = obtenerDocumentosRequeridos(tipoPersona, estadoCivil);
    setDefiniciones(defs);

    // Inicializar estado de documentos si no existen
    if (documentos.length === 0) {
      const estadosIniciales: EstadoDocumento[] = defs.map((def) => ({
        tipo: def.tipo,
        validado: false,
        subiendo: false,
        validando: false,
      }));
      onDocumentosActualizados(estadosIniciales);
    }
  }, [tipoPersona, estadoCivil]);

  const actualizarDocumento = (tipo: TipoDocumento, cambios: Partial<EstadoDocumento>) => {
    const nuevosDocumentos = documentos.map((doc) =>
      doc.tipo === tipo ? { ...doc, ...cambios } : doc
    );
    onDocumentosActualizados(nuevosDocumentos);
  };

  const handleArchivoSeleccionado = async (tipo: TipoDocumento, archivo: File) => {
    actualizarDocumento(tipo, {
      archivo,
      validado: false,
      validacionRespuesta: undefined,
      documentoId: undefined,
      error: undefined,
      subiendo: true,
    });

    try {
      const resultado = await subirDocumento({ kycId, tipo, archivo });

      actualizarDocumento(tipo, {
        documentoId: resultado.documentoId,
        subiendo: false,
      });

      toast.success(`Documento "${tipo}" subido. Haga clic en "Validar Documento".`);
    } catch (error) {
      actualizarDocumento(tipo, {
        subiendo: false,
        error: error instanceof Error ? error.message : 'Error al subir el documento',
      });
      toast.error('Error al subir el documento');
    }
  };

  const handleValidar = async (tipo: TipoDocumento) => {
    const doc = documentos.find((d) => d.tipo === tipo);
    if (!doc?.documentoId) return;

    actualizarDocumento(tipo, { validando: true, error: undefined });

    try {
      const resultado = await validarDocumento(doc.documentoId);

      actualizarDocumento(tipo, {
        validando: false,
        validado: resultado.validacion.valido,
        validacionRespuesta: resultado.validacion,
      });

      if (resultado.validacion.valido) {
        if (resultado.validacion.advertencia) {
          toast('Documento validado con advertencia. Revise los detalles.', { icon: '⚠️' });
        } else {
          toast.success('Documento validado exitosamente');
        }
      } else {
        toast.error(`Documento inválido: ${resultado.validacion.motivo}`);
      }
    } catch (error) {
      actualizarDocumento(tipo, {
        validando: false,
        error: error instanceof Error ? error.message : 'Error al validar el documento',
      });
      toast.error('Error al validar el documento');
    }
  };

  // Verificar si todos los documentos requeridos están validados
  const documentosRequeridos = definiciones.filter((d) => d.requerido);
  const todosValidados = documentosRequeridos.every((def) => {
    const doc = documentos.find((d) => d.tipo === def.tipo);
    return doc?.validado;
  });

  const handleSiguiente = () => {
    if (!todosValidados) {
      toast.error('Debe validar todos los documentos requeridos antes de continuar');
      return;
    }
    onSiguiente();
  };

  const contadorValidados = documentosRequeridos.filter((def) => {
    const doc = documentos.find((d) => d.tipo === def.tipo);
    return doc?.validado;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Documentos Requeridos</h2>
        <p className="text-sm text-gray-500 mt-1">
          Suba y valide cada documento. La validación es obligatoria antes de continuar.
        </p>
      </div>

      {/* Indicador de progreso de documentos */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Documentos validados</span>
            <span className="font-medium">{contadorValidados} / {documentosRequeridos.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: documentosRequeridos.length > 0 ? `${(contadorValidados / documentosRequeridos.length) * 100}%` : '0%' }}
            />
          </div>
        </div>
        {todosValidados && (
          <div className="flex items-center gap-1 text-green-600 shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Completo</span>
          </div>
        )}
      </div>

      {/* Lista de documentos */}
      <div className="space-y-4">
        {definiciones.map((def) => {
          const estadoDoc = documentos.find((d) => d.tipo === def.tipo) || {
            tipo: def.tipo,
            validado: false,
            subiendo: false,
            validando: false,
          };

          return (
            <DocumentUpload
              key={def.tipo}
              definicion={def}
              estado={estadoDoc}
              onArchivoSeleccionado={(archivo) => handleArchivoSeleccionado(def.tipo, archivo)}
              onValidar={() => handleValidar(def.tipo)}
            />
          );
        })}
      </div>

      {/* Aviso sobre validación bloqueante */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
        <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-blue-700">
          La validación de documentos es obligatoria. Si un documento no pasa la validación, debe reemplazarlo con uno válido.
        </p>
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
          disabled={!todosValidados}
          className="px-6 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Revisar y Enviar
        </button>
      </div>
    </div>
  );
};

export default DocumentsStep;
