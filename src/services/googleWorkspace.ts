import { SheetRowRecord, DRIVE_FOLDER_ID } from '../types';

/**
 * Uploads a ZIP file to Google Drive folder using Multipart upload.
 * Returns the shareable webViewLink or Drive link.
 */
export async function uploadZipToDrive(
  file: File,
  accessToken: string,
  folderId: string = DRIVE_FOLDER_ID
): Promise<{ fileId: string; webViewLink: string }> {
  const metadata = {
    name: file.name,
    parents: [folderId],
    mimeType: file.type || 'application/zip',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error?.message ||
        `Error al subir archivo a Drive (${response.status}: ${response.statusText})`
    );
  }

  const data = await response.json();
  const fileId = data.id;
  const link = `https://drive.google.com/open?id=${fileId}`;

  return {
    fileId,
    webViewLink: link,
  };
}

/**
 * Reads all rows from a Google Sheet given spreadsheetId and optional range.
 */
export async function fetchSheetRows(
  spreadsheetId: string,
  range: string = 'A:Q',
  accessToken: string
): Promise<string[][]> {
  const encodedRange = encodeURIComponent(range);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error?.message ||
        `Error al leer filas del Google Sheet (${response.status})`
    );
  }

  const data = await response.json();
  return data.values || [];
}

/**
 * Appends a row to a Google Sheet.
 * Values order matching columns A -> L:
 * A: Marca temporal
 * B: Dirección de correo electrónico (usuario autenticado)
 * C: Nombre de la aplicación
 * D: Objetivo
 * E: Email contacto (obligatorio)
 * F: Archivo a publicar (Drive link)
 * G: Confirmación de contenido
 * H: Tipo de solicitud
 * I: Versión de la aplicación
 * J: Area o departamento solicitante
 * K: Descripción de cambios realizados
 * L: Políticas de publicación
 */
export async function appendRowToSheet(
  spreadsheetId: string,
  record: SheetRowRecord,
  accessToken: string,
  range: string = 'A:L'
): Promise<any> {
  const rowValues = [
    record.marcaTemporal,
    record.emailUsuario,
    record.nombreApp,
    record.objetivo,
    record.emailContacto,
    record.archivoPublicar,
    record.confirmacionContenido,
    record.tipoSolicitud,
    record.versionApp,
    record.areaDepartamento,
    record.descripcionCambios,
    record.politicasPublicacion,
  ];

  const encodedRange = encodeURIComponent(range);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error?.message ||
        `Error al registrar en Google Sheet (${response.status})`
    );
  }

  return response.json();
}
