import React, { useState } from 'react';
import { FileSpreadsheet, Check, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface SheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetId: string;
  onSave: (newSpreadsheetId: string) => void;
  onRefreshRows?: () => Promise<void>;
  isLoading?: boolean;
}

export const SheetConfigModal: React.FC<SheetConfigModalProps> = ({
  isOpen,
  onClose,
  spreadsheetId,
  onSave,
  onRefreshRows,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState(spreadsheetId);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    let cleanId = inputValue.trim();

    // Extract ID from URL if user pastes the full sheet URL
    // e.g. https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit...
    const urlMatch = cleanId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (urlMatch && urlMatch[1]) {
      cleanId = urlMatch[1];
    }

    if (!cleanId) {
      setError('Por favor ingresa un ID o URL válido del Google Sheet.');
      return;
    }

    setError(null);
    onSave(cleanId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-left relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Vincular Hoja de Google Sheets
            </h3>
            <p className="text-xs text-slate-500">
              Ingresa el ID o enlace completo del archivo de Sheet compartido
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              URL o ID del Google Sheet
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              placeholder="https://docs.google.com/spreadsheets/d/1abcXYZ.../edit o 1abcXYZ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {error && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800">
              Estructura esperada de columnas (A - L):
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              A: Marca temporal | B: Email usuario | C: Nombre de la aplicación | D: Objetivo | E: Email contacto | F: Archivo a publicar | G: Confirmación | H: Tipo de solicitud | I: Versión | J: Area | K: Descripción cambios | L: Políticas
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Guardar y Vincular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
