import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileArchive,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  FolderGit2,
  Info,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { SheetRowRecord, DRIVE_FOLDER_URL } from '../types';

interface ProjectFormProps {
  currentUserEmail: string;
  previousRecords: SheetRowRecord[];
  isSubmitting: boolean;
  onSubmit: (formData: {
    nombreApp: string;
    objetivo: string;
    emailContacto: string;
    zipFile: File;
    tipoSolicitud: 'Nueva aplicación' | 'Actualización de versión existente';
    versionApp: string;
    areaDepartamento: string;
    descripcionCambios: string;
    confirmacionContenido: boolean;
    politicasPublicacion: boolean;
  }) => Promise<void>;
  preselectedRecord?: SheetRowRecord | null;
}

const DEPARTMENTS = [
  'Excelencia operativa',
  'Area Legal',
  'Legal',
  'Recursos Humanos',
  'Sistemas / IT',
  'Operaciones',
  'Finanzas',
  'Comercial',
  'Otro',
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  currentUserEmail,
  previousRecords,
  isSubmitting,
  onSubmit,
  preselectedRecord,
}) => {
  // Form fields
  const [tipoSolicitud, setTipoSolicitud] = useState<'Nueva aplicación' | 'Actualización de versión existente'>('Nueva aplicación');
  const [nombreApp, setNombreApp] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [emailContacto, setEmailContacto] = useState(currentUserEmail || '');
  const [versionApp, setVersionApp] = useState('1.0');
  const [areaDepartamento, setAreaDepartamento] = useState(DEPARTMENTS[0]);
  const [descripcionCambios, setDescripcionCambios] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [confirmacionContenido, setConfirmacionContenido] = useState(false);
  const [politicasPublicacion, setPoliticasPublicacion] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync default contact email with current user email if empty
  useEffect(() => {
    if (!emailContacto && currentUserEmail) {
      setEmailContacto(currentUserEmail);
    }
  }, [currentUserEmail]);

  // Extract unique applications registered before
  // Consider Col C (nombreApp) and Col E (emailContacto)
  const userApplications = React.useMemo(() => {
    const map = new Map<string, SheetRowRecord>();

    // Reverse so latest entries take priority or can inspect full history
    [...previousRecords].reverse().forEach((record) => {
      const normalizedName = record.nombreApp?.trim();
      if (!normalizedName) return;

      if (!map.has(normalizedName.toLowerCase())) {
        map.set(normalizedName.toLowerCase(), record);
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.nombreApp.localeCompare(b.nombreApp, undefined, { sensitivity: 'base' })
    );
  }, [previousRecords]);

  // When preselected record changes from parent
  useEffect(() => {
    if (preselectedRecord) {
      setTipoSolicitud('Actualización de versión existente');
      setNombreApp(preselectedRecord.nombreApp);
      setObjetivo(preselectedRecord.objetivo || '');
      setEmailContacto(preselectedRecord.emailContacto || currentUserEmail);
      if (preselectedRecord.areaDepartamento) {
        setAreaDepartamento(preselectedRecord.areaDepartamento);
      }

      // Suggest next version number if numeric
      const currentVer = parseFloat(preselectedRecord.versionApp);
      if (!isNaN(currentVer)) {
        setVersionApp((currentVer + 0.1).toFixed(1));
      } else {
        setVersionApp('1.1');
      }
    }
  }, [preselectedRecord, currentUserEmail]);

  // Handle dropdown change for existing app
  const handleSelectExistingApp = (appName: string) => {
    if (!appName) {
      setNombreApp('');
      return;
    }

    const matched = userApplications.find(
      (app) => app.nombreApp.toLowerCase() === appName.toLowerCase()
    );

    if (matched) {
      setNombreApp(matched.nombreApp);
      setObjetivo(matched.objetivo || '');
      setEmailContacto(matched.emailContacto || currentUserEmail);
      if (matched.areaDepartamento) {
        setAreaDepartamento(matched.areaDepartamento);
      }

      // Auto-increment version suggestion
      const v = parseFloat(matched.versionApp);
      if (!isNaN(v)) {
        setVersionApp((v + 0.1).toFixed(1));
      } else {
        setVersionApp(`${matched.versionApp}.1`);
      }
    } else {
      setNombreApp(appName);
    }
  };

  // Switch request type handler
  const handleTypeChange = (newType: 'Nueva aplicación' | 'Actualización de versión existente') => {
    setTipoSolicitud(newType);
    if (newType === 'Nueva aplicación') {
      setVersionApp('1.0');
      setDescripcionCambios('');
    } else {
      // Default to first app if available
      if (userApplications.length > 0 && !nombreApp) {
        handleSelectExistingApp(userApplications[0].nombreApp);
      }
    }
  };

  // File drop & select handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setErrors((prev) => ({
        ...prev,
        zipFile: 'Solo se permiten archivos comprimidos en formato .ZIP',
      }));
      setZipFile(null);
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.zipFile;
      return copy;
    });
    setZipFile(file);
  };

  // Form submit validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!nombreApp.trim()) {
      newErrors.nombreApp = 'El nombre de la aplicación es obligatorio.';
    }

    if (!objetivo.trim()) {
      newErrors.objetivo = 'El objetivo de la aplicación es obligatorio.';
    }

    if (!emailContacto.trim()) {
      newErrors.emailContacto = 'El email de contacto es obligatorio llenar.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailContacto.trim())) {
      newErrors.emailContacto = 'Ingrese un formato de correo electrónico válido.';
    }

    if (!zipFile) {
      newErrors.zipFile = 'Debe seleccionar un archivo .ZIP para publicar.';
    }

    if (!versionApp.trim()) {
      newErrors.versionApp = 'La versión de la aplicación es obligatoria.';
    }

    if (tipoSolicitud === 'Actualización de versión existente' && !descripcionCambios.trim()) {
      newErrors.descripcionCambios = 'Describa brevemente los cambios realizados en esta actualización.';
    }

    if (!confirmacionContenido) {
      newErrors.confirmacionContenido =
        'Debe confirmar que el ZIP contiene únicamente archivos web válidos (HTML con index.html en raíz, CSS, JS).';
    }

    if (!politicasPublicacion) {
      newErrors.politicasPublicacion =
        'Debe aceptar las políticas de publicación de aplicaciones internas.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to top of form or first error
      return;
    }

    await onSubmit({
      nombreApp: nombreApp.trim(),
      objetivo: objetivo.trim(),
      emailContacto: emailContacto.trim(),
      zipFile: zipFile!,
      tipoSolicitud,
      versionApp: versionApp.trim(),
      areaDepartamento,
      descripcionCambios: descripcionCambios.trim(),
      confirmacionContenido,
      politicasPublicacion,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Banner: Authenticated user indicator */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            {currentUserEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs text-blue-800 font-semibold uppercase tracking-wider">
              Autenticado en Google Workspace
            </div>
            <div className="text-sm font-bold text-slate-800">
              {currentUserEmail}
            </div>
          </div>
        </div>

        <div className="text-xs bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg px-3 py-2 text-slate-600">
          <span className="font-semibold text-blue-700">Columna B en Sheet:</span> se registrará automáticamente tu dirección de correo electrónico institucional.
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
        
        {/* Section 1: Tipo de Solicitud */}
        <div className="p-6">
          <label className="block text-sm font-bold text-slate-900 mb-3">
            Tipo de Solicitud <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                tipoSolicitud === 'Nueva aplicación'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="tipoSolicitud"
                value="Nueva aplicación"
                checked={tipoSolicitud === 'Nueva aplicación'}
                onChange={() => handleTypeChange('Nueva aplicación')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="ml-3">
                <span className="block text-sm font-bold text-slate-900">
                  Nueva aplicación
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Primer despliegue de un nuevo desarrollo o proyecto en IIS.
                </span>
              </div>
            </label>

            <label
              className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                tipoSolicitud === 'Actualización de versión existente'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="tipoSolicitud"
                value="Actualización de versión existente"
                checked={tipoSolicitud === 'Actualización de versión existente'}
                onChange={() => handleTypeChange('Actualización de versión existente')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="ml-3">
                <span className="block text-sm font-bold text-slate-900">
                  Actualización de versión existente
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Cargar nueva versión precargando datos registrados del Sheet.
                </span>
              </div>
            </label>
          </div>

          {/* Conditional Dropdown for Existing Applications */}
          {tipoSolicitud === 'Actualización de versión existente' && (
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Seleccionar aplicación registrada anteriormente:
                </label>
                <span className="text-[11px] text-slate-500">
                  {userApplications.length} aplicaciones encontradas
                </span>
              </div>
              <select
                value={nombreApp}
                onChange={(e) => handleSelectExistingApp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="">-- Elige una aplicación para precargar datos --</option>
                {userApplications.map((app) => (
                  <option key={app.nombreApp} value={app.nombreApp}>
                    {app.nombreApp} (v{app.versionApp} - {app.emailContacto})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Al seleccionar una aplicación, se precargará su Nombre, Objetivo y Contacto para facilitar la edición.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Datos de la Aplicación */}
        <div className="p-6 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>1. Información de la Aplicación</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Columna C: Nombre de la aplicación */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Nombre de la aplicación (Columna C) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombreApp}
                onChange={(e) => setNombreApp(e.target.value)}
                placeholder="Ej. Marcas, Simpol, KPI-IT, etc."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.nombreApp
                    ? 'border-red-500 bg-red-50/50'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              />
              {errors.nombreApp && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.nombreApp}
                </p>
              )}
            </div>

            {/* Columna E: Email de contacto (obligatorio) */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Email contacto (Columna E) <span className="text-red-500">* (Obligatorio)</span>
              </label>
              <input
                type="email"
                value={emailContacto}
                onChange={(e) => setEmailContacto(e.target.value)}
                placeholder="correo@polakgrupo.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.emailContacto
                    ? 'border-red-500 bg-red-50/50'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              />
              {errors.emailContacto && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.emailContacto}
                </p>
              )}
            </div>
          </div>

          {/* Columna D: Objetivo */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Objetivo de la aplicación (Columna D) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              placeholder="Describe el propósito y funcionalidad de la aplicación..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.objetivo
                  ? 'border-red-500 bg-red-50/50'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            />
            {errors.objetivo && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.objetivo}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Columna I: Versión de la aplicación */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Versión de la aplicación (Columna I) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={versionApp}
                onChange={(e) => setVersionApp(e.target.value)}
                placeholder="1.0 o 2.1"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.versionApp
                    ? 'border-red-500 bg-red-50/50'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              />
              {errors.versionApp && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.versionApp}
                </p>
              )}
            </div>

            {/* Columna J: Area o departamento */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Área o departamento solicitante (Columna J) <span className="text-red-500">*</span>
              </label>
              <select
                value={areaDepartamento}
                onChange={(e) => setAreaDepartamento(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Columna K: Descripción de cambios realizados */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Descripción de cambios realizados (Columna K){' '}
              {tipoSolicitud === 'Actualización de versión existente' ? (
                <span className="text-red-500">* (Requerido para actualizaciones)</span>
              ) : (
                <span className="text-slate-400">(Opcional en nueva aplicación)</span>
              )}
            </label>
            <textarea
              rows={2}
              value={descripcionCambios}
              onChange={(e) => setDescripcionCambios(e.target.value)}
              placeholder="Detalla qué cambios, fixes o nuevas funciones incluye esta versión..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.descripcionCambios
                  ? 'border-red-500 bg-red-50/50'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            />
            {errors.descripcionCambios && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.descripcionCambios}
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Archivo ZIP y Google Drive */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>2. Archivo a Publicar (Solo formato .ZIP)</span>
              <span className="text-red-500">*</span>
            </h3>
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              Destino en Google Drive
            </a>
          </div>

          {/* Upload dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              zipFile
                ? 'border-emerald-500 bg-emerald-50/30'
                : errors.zipFile
                ? 'border-red-400 bg-red-50/30'
                : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              onChange={handleFileChange}
              className="hidden"
            />

            {zipFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-sm">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-900">{zipFile.name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {(zipFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Archivo ZIP preparado para subida
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZipFile(null);
                  }}
                  className="mt-3 text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
                >
                  Cambiar archivo ZIP
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  Haz clic para seleccionar o arrastra aquí tu archivo .ZIP
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  El ZIP debe contener el archivo <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono text-[11px]">index.html</code> directamente en la raíz para ser desplegado exitosamente por IIS.
                </p>
                <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Solo se permiten archivos comprimidos (.zip). Se guardará en la carpeta de Drive designada.
                </div>
              </div>
            )}
          </div>

          {errors.zipFile && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.zipFile}
            </p>
          )}
        </div>

        {/* Section 4: Términos, Confirmación y Políticas */}
        <div className="p-6 bg-slate-50/70 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            3. Términos y Condiciones de Publicación
          </h3>

          <div className="space-y-3">
            {/* Columna G: Confirmación de contenido */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={confirmacionContenido}
                onChange={(e) => setConfirmacionContenido(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
              />
              <div className="text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  Confirmación de Contenido Técnico (Columna G):
                </strong>
                Confirmo que el ZIP contiene únicamente archivos HTML (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">index.html</code> incluido en la raíz), CSS y JavaScript (sin código de servidor, sin ejecutables ni archivos temporales como <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">__MACOSX</code> o <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">.DS_Store</code>).
              </div>
            </label>
            {errors.confirmacionContenido && (
              <p className="text-xs text-red-600 pl-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.confirmacionContenido}
              </p>
            )}

            {/* Columna L: Políticas de publicación */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={politicasPublicacion}
                onChange={(e) => setPoliticasPublicacion(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
              />
              <div className="text-xs leading-relaxed text-slate-700">
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  Políticas de Publicación (Columna L):
                </strong>
                He leído y acepto las políticas de publicación de aplicaciones internas de Polak Grupo.
              </div>
            </label>
            {errors.politicasPublicacion && (
              <p className="text-xs text-red-600 pl-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.politicasPublicacion}
              </p>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Al dar click en <strong>Confirmar y Enviar Solicitud</strong>, el archivo ZIP se cargará en Google Drive y la fila se agregará a Google Sheets con la fecha y hora actual.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Procesando y Guardando...</span>
              </>
            ) : (
              <>
                <span>Confirmar y Enviar Solicitud</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </form>
  );
};
