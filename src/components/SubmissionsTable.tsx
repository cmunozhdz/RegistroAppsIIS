import React from 'react';
import { SheetRowRecord } from '../types';
import { ExternalLink, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface SubmissionsTableProps {
  records: SheetRowRecord[];
  currentUserEmail?: string;
  onSelectAppForUpdate?: (appRecord: SheetRowRecord) => void;
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  records,
  currentUserEmail,
  onSelectAppForUpdate,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            Historial de Aplicaciones Registradas
          </h3>
          <p className="text-xs text-slate-500">
            Columnas sincronizadas con el Google Sheet ({records.length} registros cargados)
          </p>
        </div>

        {currentUserEmail && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Usuario: <strong className="font-semibold">{currentUserEmail}</strong>
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Fecha / Marca</th>
              <th className="py-3 px-4">Usuario (Col. B)</th>
              <th className="py-3 px-4">Aplicación (Col. C)</th>
              <th className="py-3 px-4">Objetivo (Col. D)</th>
              <th className="py-3 px-4">Contacto (Col. E)</th>
              <th className="py-3 px-4">Tipo & Versión</th>
              <th className="py-3 px-4">Archivo / Drive</th>
              <th className="py-3 px-4">Estatus</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((row, index) => {
              const isRejected = row.estatus?.toLowerCase().includes('rechazado');
              const isSuccess = row.estatus?.toLowerCase().includes('finalizado') || row.estatus?.toLowerCase().includes('éxito') || row.estatus?.toLowerCase().includes('exitosamente');

              return (
                <tr
                  key={index}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {row.marcaTemporal}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    <span className="truncate max-w-[130px] inline-block" title={row.emailUsuario}>
                      {row.emailUsuario}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-blue-700 font-semibold">
                    {row.nombreApp}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={row.objetivo}>
                    {row.objetivo}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="truncate max-w-[120px] inline-block" title={row.emailContacto}>
                      {row.emailContacto}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-500">
                        {row.tipoSolicitud === 'Actualización de versión existente' ? 'Actualización' : 'Nueva'}
                      </span>
                      <span className="font-semibold text-slate-700">v{row.versionApp}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {row.archivoPublicar?.startsWith('http') ? (
                      <a
                        href={row.archivoPublicar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                      >
                        <span>Ver Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px] truncate max-w-[100px] inline-block">
                        {row.archivoPublicar}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Publicado</span>
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200" title={row.observaciones}>
                        <XCircle className="w-3 h-3 text-red-600" />
                        <span>Rechazado</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>{row.estatus || 'En proceso'}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {onSelectAppForUpdate && (
                      <button
                        type="button"
                        onClick={() => onSelectAppForUpdate(row)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 cursor-pointer"
                      >
                        Actualizar v
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
