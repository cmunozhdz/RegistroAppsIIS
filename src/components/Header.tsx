import React from 'react';
import { User } from 'firebase/auth';
import { LogOut, ExternalLink, ShieldCheck, FolderKanban } from 'lucide-react';
import { DRIVE_FOLDER_URL } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onOpenSheetConfig?: () => void;
  sheetIdConfigured?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onOpenSheetConfig,
  sheetIdConfigured = false,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FolderKanban className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white">
                Portal de Publicación de Aplicaciones
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/60 text-blue-200 border border-blue-700/50">
                Polak Grupo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Despliegue automatizado en IIS & Control de Versiones
            </p>
          </div>
        </div>

        {/* User / Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <a
            href={DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
            title="Abrir carpeta de subidas en Google Drive"
          >
            <span>Carpeta Drive</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>

          {user && (
            <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuario'}
                  className="h-7 w-7 rounded-full border border-slate-600 object-cover"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {(user.displayName || user.email || 'U').charAt(0)}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 leading-none">
                  {user.displayName || 'Usuario'}
                </div>
                <div className="text-[11px] text-slate-400 leading-none mt-1">
                  {user.email}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="ml-1 p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
