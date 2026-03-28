// ============================================================
// Página principal del módulo KYC
// Wizard de múltiples pasos
// ============================================================

import React, { useState, useCallback } from 'react';
import { EstadoFormulario, TipoPersona, DatosRegistroCivil, EstadoDocumento } from '../types';
import { iniciarKyc } from '../services/api';
import BarraProgreso from '../components/BarraProgreso';
import CedulaStep from '../components/CedulaStep';
import PersonTypeStep from '../components/PersonTypeStep';
import DocumentsStep from '../components/DocumentsStep';
import ReviewStep from '../components/ReviewStep';
import SuccessStep from '../components/SuccessStep';
import toast from 'react-hot-toast';

// Definición de pasos del wizard
const PASOS = [
  { numero: 1, etiqueta: 'Identificación' },
  { numero: 2, etiqueta: 'Tipo Persona' },
  { numero: 3, etiqueta: 'Documentos' },
  { numero: 4, etiqueta: 'Revisión' },
];

const estadoInicial: EstadoFormulario = {
  paso: 1,
  cedula: '',
  ingresoManual: false,
  nombres: '',
  fechaNacimiento: '',
  estadoCivil: '',
  documentos: [],
};

const KycPage: React.FC = () => {
  const [estado, setEstado] = useState<EstadoFormulario>(estadoInicial);
  const [referencia, setReferencia] = useState('');
  const [exito, setExito] = useState(false);
  const [inicializandoKyc, setInicializandoKyc] = useState(false);

  const actualizarEstado = (cambios: Partial<EstadoFormulario>) => {
    setEstado((prev) => ({ ...prev, ...cambios }));
  };

  // ============================================================
  // Paso 1: Cédula
  // ============================================================
  const handleDatosCedula = useCallback(
    (datos: {
      cedula: string;
      datosRegistroCivil?: DatosRegistroCivil;
      ingresoManual: boolean;
      nombres: string;
      fechaNacimiento: string;
      estadoCivil: string;
    }) => {
      actualizarEstado({
        cedula: datos.cedula,
        datosRegistroCivil: datos.datosRegistroCivil,
        ingresoManual: datos.ingresoManual,
        nombres: datos.nombres,
        fechaNacimiento: datos.fechaNacimiento,
        estadoCivil: datos.estadoCivil,
      });
    },
    []
  );

  const irAlPaso2 = () => {
    actualizarEstado({ paso: 2 });
  };

  // ============================================================
  // Paso 2: Tipo de Persona
  // ============================================================
  const handleSeleccionarTipoPersona = (tipo: TipoPersona) => {
    actualizarEstado({ tipoPersona: tipo });
  };

  const irAlPaso3 = async () => {
    if (!estado.tipoPersona) return;

    setInicializandoKyc(true);
    try {
      // Si no tenemos kycId aún, inicializar el KYC
      if (!estado.kycId) {
        const resultado = await iniciarKyc({
          cedula: estado.cedula,
          tipoPersona: estado.tipoPersona,
          nombres: estado.nombres,
          fechaNacimiento: estado.fechaNacimiento,
          estadoCivil: estado.estadoCivil,
          datosRegistroCivil: estado.datosRegistroCivil,
          ingresoManual: estado.ingresoManual,
        });
        actualizarEstado({ kycId: resultado.kycId, paso: 3, documentos: [] });
      } else {
        actualizarEstado({ paso: 3, documentos: [] });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al inicializar la solicitud KYC');
    } finally {
      setInicializandoKyc(false);
    }
  };

  // ============================================================
  // Paso 3: Documentos
  // ============================================================
  const handleDocumentosActualizados = (documentos: EstadoDocumento[]) => {
    actualizarEstado({ documentos });
  };

  const irAlPaso4 = () => {
    actualizarEstado({ paso: 4 });
  };

  // ============================================================
  // Paso 4: Revisión y envío
  // ============================================================
  const handleExito = (ref: string) => {
    setReferencia(ref);
    setExito(true);
  };

  // ============================================================
  // Reiniciar formulario
  // ============================================================
  const handleNuevaSolicitud = () => {
    setEstado(estadoInicial);
    setExito(false);
    setReferencia('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Seguros Latina</p>
              <p className="text-primary-300 text-xs">Módulo KYC</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary-300 text-xs">Conozca a su Cliente</p>
            <p className="text-primary-300 text-xs">Know Your Customer</p>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-2xl">
          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Título y barra de progreso */}
            {!exito && (
              <div className="px-6 pt-6 pb-2 border-b border-gray-100">
                <h1 className="text-lg font-bold text-gray-900">
                  Formulario KYC
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Complete todos los pasos para verificar la identidad del cliente
                </p>
                <BarraProgreso pasoActual={estado.paso} pasos={PASOS} />
              </div>
            )}

            {/* Contenido del paso */}
            <div className="p-6">
              {exito ? (
                <SuccessStep
                  referencia={referencia}
                  nombres={estado.nombres}
                  cedula={estado.cedula}
                  onNuevaSolicitud={handleNuevaSolicitud}
                />
              ) : (
                <>
                  {estado.paso === 1 && (
                    <CedulaStep
                      cedula={estado.cedula}
                      datosRegistroCivil={estado.datosRegistroCivil}
                      ingresoManual={estado.ingresoManual}
                      nombres={estado.nombres}
                      fechaNacimiento={estado.fechaNacimiento}
                      estadoCivil={estado.estadoCivil}
                      onDatosObtenidos={handleDatosCedula}
                      onSiguiente={irAlPaso2}
                    />
                  )}

                  {estado.paso === 2 && (
                    <PersonTypeStep
                      tipoPersona={estado.tipoPersona}
                      onSeleccionar={handleSeleccionarTipoPersona}
                      onAnterior={() => actualizarEstado({ paso: 1 })}
                      onSiguiente={irAlPaso3}
                    />
                  )}

                  {estado.paso === 3 && estado.kycId && estado.tipoPersona && (
                    <DocumentsStep
                      kycId={estado.kycId}
                      tipoPersona={estado.tipoPersona}
                      estadoCivil={estado.estadoCivil}
                      documentos={estado.documentos}
                      onDocumentosActualizados={handleDocumentosActualizados}
                      onAnterior={() => actualizarEstado({ paso: 2 })}
                      onSiguiente={irAlPaso4}
                    />
                  )}

                  {estado.paso === 4 && (
                    <ReviewStep
                      estado={estado}
                      onAnterior={() => actualizarEstado({ paso: 3 })}
                      onExito={handleExito}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-primary-300 text-xs mt-4">
            Seguros Latina · Sistema KYC v1.0 · Datos protegidos y encriptados
          </p>
        </div>
      </main>

      {/* Overlay de carga al inicializar KYC */}
      {inicializandoKyc && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 shadow-xl">
            <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-700 font-medium">Inicializando solicitud...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycPage;
