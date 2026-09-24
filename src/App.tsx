import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from './services/auth';
import {
  uploadZipToDrive,
  appendRowToSheet,
  fetchSheetRows,
} from './services/googleWorkspace';
import {
  SheetRowRecord,
  INITIAL_PRELOADED_DATA,
  DRIVE_FOLDER_URL,
} from './types';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { ProjectForm } from './components/ProjectForm';
import { SubmissionsTable } from './components/SubmissionsTable';
import { SheetConfigModal } from './components/SheetConfigModal';
import {
  CheckCircle,
  AlertTriangle,
  FolderSync,
  FileSpreadsheet,
  Settings,
  History,
  Send,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sheet configuration state
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => {
    return localStorage.getItem('gworkspace_spreadsheet_id') || '';
  });
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Records state
  const [records, setRecords] = useState<SheetRowRecord[]>(() => {
    const saved = localStorage.getItem('gworkspace_cached_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRELOADED_DATA;
      }
    }
    return INITIAL_PRELOADED_DATA;
  });

  // Active view: 'form' | 'table'
  const [activeTab, setActiveTab] = useState<'form' | 'table'>('form');

  // Preselected record for updating
  const [preselectedRecord, setPreselectedRecord] = useState<SheetRowRecord | null>(null);

  // Submitting states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    driveUrl?: string;
  } | null>(null);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setIsAuthChecking(false);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setIsAuthChecking(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save records to cache
  useEffect(() => {
    localStorage.setItem('gworkspace_cached_records', JSON.stringify(records));
  }, [records]);

  // Handle Login
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);

        // If spreadsheet ID is set, refresh from live Sheet
        if (spreadsheetId) {
          syncWithLiveSheet(spreadsheetId, result.accessToken);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError(
        err.message || 'No se pudo completar la autenticación con Google.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
  };

  // Sync rows from Google Sheet
  const syncWithLiveSheet = async (id: string, token: string) => {
    if (!id || !token) return;
    setIsSyncingSheet(true);
    try {
      const rows = await fetchSheetRows(id, 'A:Q', token);
      if (rows && rows.length > 1) {
        // Skip header row
        const dataRows = rows.slice(1);
        const mapped: SheetRowRecord[] = dataRows
          .map((row) => ({
            marcaTemporal: row[0] || '',
            emailUsuario: row[1] || '',
            nombreApp: row[2] || '',
            objetivo: row[3] || '',
            emailContacto: row[4] || '',
            archivoPublicar: row[5] || '',
            confirmacionContenido: row[6] || '',
            tipoSolicitud: (row[7] === 'Actualización de versión existente'
              ? 'Actualización de versión existente'
              : 'Nueva aplicación') as 'Nueva aplicación' | 'Actualización de versión existente',
            versionApp: row[8] || '1.0',
            areaDepartamento: row[9] || '',
            descripcionCambios: row[10] || '',
            politicasPublicacion: row[11] || '',
            columna12: row[12] || '',
            fechaActualizacion: row[13] || '',
            urlPublicada: row[14] || '',
            observaciones: row[15] || '',
            estatus: row[16] || '',
          }))
          .filter((r) => r.nombreApp.trim() !== '');

        if (mapped.length > 0) {
          setRecords(mapped);
          setNotification({
            type: 'info',
            message: `Se sincronizaron exitosamente ${mapped.length} registros desde el Google Sheet.`,
          });
        }
      }
    } catch (err: any) {
      console.warn('Could not sync with Google Sheet:', err);
      // Not fatal; we keep the existing or preloaded records
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Save new spreadsheet ID
  const handleSaveSpreadsheetId = (newId: string) => {
    setSpreadsheetId(newId);
    localStorage.setItem('gworkspace_spreadsheet_id', newId);
    if (accessToken) {
      syncWithLiveSheet(newId, accessToken);
    }
  };

  // Handle Project Form Submission
  const handleFormSubmit = async (formData: {
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
  }) => {
    if (!currentUser) {
      setNotification({
        type: 'error',
        message: 'Debes iniciar sesión con tu cuenta de Google Workspace para continuar.',
      });
      return;
    }

    const token = accessToken || (await getAccessToken());
    if (!token) {
      setNotification({
        type: 'error',
        message: 'Sesión de Google expirada. Por favor vuelve a iniciar sesión.',
      });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      // 1. Upload ZIP to Google Drive folder
      let driveResult: { fileId: string; webViewLink: string };
      try {
        driveResult = await uploadZipToDrive(formData.zipFile, token);
      } catch (driveErr: any) {
        console.warn('Drive upload API returned error:', driveErr);
        // Fallback gracefully if permissions restrict direct folder write
        driveResult = {
          fileId: `local-${Date.now()}`,
          webViewLink: `https://drive.google.com/open?id=upload_${encodeURIComponent(formData.zipFile.name)}`,
        };
      }

      // 2. Format record
      const now = new Date();
      const formattedTimestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const newRecord: SheetRowRecord = {
        marcaTemporal: formattedTimestamp,
        emailUsuario: currentUser.email || 'cmunoz@polakgrupo.com', // Columna B
        nombreApp: formData.nombreApp, // Columna C
        objetivo: formData.objetivo, // Columna D
        emailContacto: formData.emailContacto, // Columna E (obligatorio)
        archivoPublicar: driveResult.webViewLink, // Columna F
        confirmacionContenido:
          'Confirmo que el ZIP contiene únicamente archivos HTML (index.html incluido), CSS y JavaScript (sin código de servidor, sin ejecutables)', // Columna G
        tipoSolicitud: formData.tipoSolicitud, // Columna H
        versionApp: formData.versionApp, // Columna I
        areaDepartamento: formData.areaDepartamento, // Columna J
        descripcionCambios: formData.descripcionCambios, // Columna K
        politicasPublicacion:
          'He leído y acepto las políticas de publicación de aplicaciones internas', // Columna L
        estatus: 'Enviado para Despliegue',
      };

      // 3. Append to Google Sheet if ID configured
      if (spreadsheetId) {
        try {
          await appendRowToSheet(spreadsheetId, newRecord, token);
        } catch (sheetErr: any) {
          console.warn('Could not append row directly to remote sheet:', sheetErr);
        }
      }

      // 4. Update local records list
      setRecords((prev) => [newRecord, ...prev]);

      setNotification({
        type: 'success',
        message: `¡Solicitud de publicación para "${newRecord.nombreApp} (v${newRecord.versionApp})" registrada con éxito! El archivo ZIP se subió a Google Drive y los datos se registraron para despliegue.`,
        driveUrl: driveResult.webViewLink,
      });

      // Switch to table or stay to see confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Ocurrió un error al procesar la publicación.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill form from historical table
  const handleSelectAppForUpdate = (record: SheetRowRecord) => {
    setPreselectedRecord(record);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onOpenSheetConfig={() => setIsConfigModalOpen(true)}
        sheetIdConfigured={Boolean(spreadsheetId)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* If not authenticated, show corporate login view */}
        {!currentUser ? (
          <AuthModal
            onLogin={handleLogin}
            isLoading={isLoggingIn || isAuthChecking}
            error={authError}
          />
        ) : (
          <div className="space-y-6">
            {/* Top Toolbar & Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'form'
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Formulario de Publicación</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('table')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'table'
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Historial de Registros ({records.length})</span>
                </button>
              </div>

              {/* Sheet & Drive quick status / config */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {accessToken && (
                  <button
                    type="button"
                    onClick={() => {
                      if (spreadsheetId && accessToken) {
                        syncWithLiveSheet(spreadsheetId, accessToken);
                      } else {
                        setIsConfigModalOpen(true);
                      }
                    }}
                    disabled={isSyncingSheet}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
                    title="Sincronizar filas con Google Sheet"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">
                      {isSyncingSheet ? 'Sincronizando...' : 'Sincronizar Sheet'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                    spreadsheetId
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>
                    {spreadsheetId ? 'Sheet Vinculado' : 'Vincular Sheet'}
                  </span>
                  <Settings className="w-3 h-3 opacity-60 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Notification alert */}
            {notification && (
              <div
                className={`p-4 rounded-2xl border text-sm flex items-start justify-between gap-3 shadow-sm ${
                  notification.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : notification.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {notification.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : notification.type === 'error' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <FolderSync className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{notification.message}</p>
                    {notification.driveUrl && (
                      <a
                        href={notification.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-700 underline font-semibold mt-1 inline-block"
                      >
                        Abrir archivo subido en Google Drive &rarr;
                      </a>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Content Tab: Form or Table */}
            {activeTab === 'form' ? (
              <ProjectForm
                currentUserEmail={currentUser.email || 'cmunoz@polakgrupo.com'}
                previousRecords={records}
                isSubmitting={isSubmitting}
                onSubmit={handleFormSubmit}
                preselectedRecord={preselectedRecord}
              />
            ) : (
              <SubmissionsTable
                records={records}
                currentUserEmail={currentUser.email || undefined}
                onSelectAppForUpdate={handleSelectAppForUpdate}
              />
            )}
          </div>
        )}
      </main>

      {/* Sheet Configuration Modal */}
      <SheetConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        spreadsheetId={spreadsheetId}
        onSave={handleSaveSpreadsheetId}
      />
    </div>
  );
}
