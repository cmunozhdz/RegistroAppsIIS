export interface SheetRowRecord {
  marcaTemporal: string;
  emailUsuario: string; // Columna B
  nombreApp: string; // Columna C
  objetivo: string; // Columna D
  emailContacto: string; // Columna E
  archivoPublicar: string; // Columna F (Google Drive URL or filename)
  confirmacionContenido: string; // Columna G
  tipoSolicitud: 'Nueva aplicación' | 'Actualización de versión existente'; // Columna H
  versionApp: string; // Columna I
  areaDepartamento: string; // Columna J
  descripcionCambios: string; // Columna K
  politicasPublicacion: string; // Columna L
  columna12?: string; // Columna M
  fechaActualizacion?: string; // Columna N
  urlPublicada?: string; // Columna O
  observaciones?: string; // Columna P
  estatus?: string; // Columna Q
}

export const INITIAL_PRELOADED_DATA: SheetRowRecord[] = [
  {
    marcaTemporal: "4/8/2026 12:03:36",
    emailUsuario: "cmunoz@polakgrupo.com",
    nombreApp: "DemoIA",
    objetivo: "Pruebas del proceso",
    emailContacto: "rhernandez@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1GKgnu_ddPPevgqKJZdV7HoftPDLD03wx",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML, CSS y JavaScript (sin codigo de servidor, sin ejecutables",
    tipoSolicitud: "Actualización de versión existente",
    versionApp: "1",
    areaDepartamento: "X",
    descripcionCambios: "",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "11/08/2026 12:25",
    observaciones: "No se encontró el archivo index.html en la raíz del ZIP.",
    estatus: "Rechazado"
  },
  {
    marcaTemporal: "6/8/2026 23:17:46",
    emailUsuario: "cmunoz@polakgrupo.com",
    nombreApp: "KPiPlanta",
    objetivo: "Mostrar indicadores de la excelencia operativa,",
    emailContacto: "cmunoz@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1GKgnu_ddPPevgqKJZdV7HoftPDLD03wx",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML, CSS y JavaScript (sin codigo de servidor, sin ejecutables",
    tipoSolicitud: "Actualización de versión existente",
    versionApp: "1.1",
    areaDepartamento: "Otro",
    descripcionCambios: "",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "11/08/2026 12:26",
    observaciones: "No se encontró el archivo index.html en la raíz del ZIP.",
    estatus: "Rechazado"
  },
  {
    marcaTemporal: "8/8/2026 7:06:16",
    emailUsuario: "cmunoz@polakgrupo.com",
    nombreApp: "demov2",
    objetivo: "Probar el flujo automatizado y validacion",
    emailContacto: "cmunoz@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1vjxuaF64JGrjS_D_jRkat6_IitvbH62o",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML, CSS y JavaScript (sin codigo de servidor, sin ejecutables",
    tipoSolicitud: "Nueva aplicación",
    versionApp: "1",
    areaDepartamento: "Otro",
    descripcionCambios: "",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "11/08/2026 12:26",
    observaciones: "No se encontró el archivo index.html en la raíz del ZIP.",
    estatus: "Rechazado"
  },
  {
    marcaTemporal: "9/8/2026 1:42:20",
    emailUsuario: "cmunoz@polakgrupo.com",
    nombreApp: "DemoV2-a",
    objetivo: "Equipo de sistemas.",
    emailContacto: "cmunoz@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1zDSKlNKRpOoFDr59Ls0dgsNdsdeqx9ml",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML, CSS y JavaScript (sin codigo de servidor, sin ejecutables",
    tipoSolicitud: "Actualización de versión existente",
    versionApp: "2.1",
    areaDepartamento: "Otro",
    descripcionCambios: "Pruebas de tareas automátizadas",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "11/08/2026 12:26",
    urlPublicada: "https://cdd.polakgrupo.com/DemoV2-a",
    observaciones: "Despliegue exitoso de la aplicación DemoV2-a descompresión de archivos y actualización completada en IIS.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "9/8/2026 1:54:05",
    emailUsuario: "cmunoz@polakgrupo.com",
    nombreApp: "Demov2",
    objetivo: "Pruebas de job , fix. actualizaba nombre de archivo",
    emailContacto: "cmunoz@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1zDSKlNKRpOoFDr59Ls0dgsNdsdeqx9ml",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML, CSS y JavaScript (sin codigo de servidor, sin ejecutables",
    tipoSolicitud: "Actualización de versión existente",
    versionApp: "1.1",
    areaDepartamento: "Excelencia operativa",
    descripcionCambios: "Me equivoque y no subi los componentes completos",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "11/08/2026 12:26",
    urlPublicada: "https://cdd.polakgrupo.com/Demov2",
    observaciones: "Despliegue y actualización de la aplicación Demov2 completado con éxito en IIS a partir del archivo ZIP.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "9/8/2026 1:54:05",
    emailUsuario: "cmunoz@polakgrupo.com",
    nombreApp: "PBA-cmh",
    objetivo: "Pruebas de job , fix. actualizaba nombre de archivo",
    emailContacto: "cmunoz@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1Jx4uWs7lgrGBw64aga323dGTSGWigNn6",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML, CSS y JavaScript (sin codigo de servidor, sin ejecutables",
    tipoSolicitud: "Actualización de versión existente",
    versionApp: "1.1",
    areaDepartamento: "Excelencia operativa",
    descripcionCambios: "Me equivoque y no subi los componentes completos",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "13/08/2026 22:13",
    urlPublicada: "https://cdd.polakgrupo.com/PBA-cmh",
    observaciones: "Despliegue exitoso de la aplicación PBA-cmh descomprimida y publicada en IIS correctamente.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "11/8/2026 15:23:02",
    emailUsuario: "rhernandez@polakgrupo.com",
    nombreApp: "KPI-IT",
    objetivo: "Visualizar los indicadores del área de IT",
    emailContacto: "rhernandez@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1Jx4uWs7lgrGBw64aga323dGTSGWigNn6",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML, CSS y JavaScript (sin codigo de servidor, sin ejecutables",
    tipoSolicitud: "Nueva aplicación",
    versionApp: "1",
    areaDepartamento: "Otro",
    descripcionCambios: "Primera versión",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "11/08/2026 17:24",
    urlPublicada: "https://cdd.polakgrupo.com/KPI-IT",
    observaciones: "Despliegue exitoso de KPI-IT: carpeta creada, archivos descomprimidos y aplicación configurada en IIS correctamente.",
    estatus: "PROCESO FINALIZADO EXITOSAMENTE"
  },
  {
    marcaTemporal: "20/8/2026 15:47:08",
    emailUsuario: "cmunoz@polakgrupo.com",
    nombreApp: "ConceptosIa",
    objetivo: "Mostrar la hoja de ruta para implementar aplicaciones con IA",
    emailContacto: "cmunoz@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1Hl5V6J0o_pMRow083kDN4p-68LgDoEkI",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML, CSS y JavaScript (sin codigo de servidor, sin ejecutables",
    tipoSolicitud: "Nueva aplicación",
    versionApp: "1",
    areaDepartamento: "Otro",
    descripcionCambios: "",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "20/08/2026 15:51",
    urlPublicada: "https://cdd.polakgrupo.com/AppIA/tablero/ConceptosIa/index.html",
    observaciones: "Despliegue exitoso de la aplicación ConceptosIa a partir de deploy_ConceptosIa.zip y publicación en IIS completada.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "25/8/2026 14:59:27",
    emailUsuario: "wiliams.lopez@polakgrupo.com",
    nombreApp: "Marcas",
    objetivo: "Corrección de errores",
    emailContacto: "wiliams.lopez@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1WQUIqfleXSENjXLxoKHzq_4V-gJOOU-g",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML (index.html incluido), CSS y JavaScript (sin código de servidor, sin ejecutables)",
    tipoSolicitud: "Actualización de versión existente",
    versionApp: "6",
    areaDepartamento: "Legal",
    descripcionCambios: "Se corrigio la carga de resultados de los forms.",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "25/08/2026 15:01",
    urlPublicada: "https://cdd.polakgrupo.com/AppIA/tablero/Marcas/index.html",
    observaciones: "Despliegue exitoso de la aplicación Marcas en IIS a partir del archivo deploy_Marcas.zip.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "1/9/2026 13:19:30",
    emailUsuario: "gustavo.martinez@polakgrupo.com",
    nombreApp: "Etiquetas",
    objetivo: "Sistema de etiquetas",
    emailContacto: "gustavo.martinez@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1ec80E6QQn8wvQLfKSA2juxsCTJFgoe2z",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML (index.html incluido), CSS y JavaScript (sin código de servidor, sin ejecutables)",
    tipoSolicitud: "Nueva aplicación",
    versionApp: "1",
    areaDepartamento: "Otro",
    descripcionCambios: "",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "01/09/2026 13:21",
    urlPublicada: "https://cdd.polakgrupo.com/AppIA/tablero/Etiquetas/index.html",
    observaciones: "Despliegue exitoso de la aplicación Etiquetas a partir de deploy_Etiquetas.zip y publicado correctamente en IIS.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "8/9/2026 12:59:55",
    emailUsuario: "cmunoz@polakgrupo.com",
    nombreApp: "Simpol",
    objetivo: "Tableros de viabilidad de proyectos excelencia operativa",
    emailContacto: "saitiel.meneses@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=13hj3dpQDJfnAIt7IWd-teusPksxZzcmN",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML (index.html incluido), CSS y JavaScript (sin código de servidor, sin ejecutables)",
    tipoSolicitud: "Actualización de versión existente",
    versionApp: "1",
    areaDepartamento: "Excelencia operativa",
    descripcionCambios: "se movio el archivo index",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "08/09/2026 13:01",
    urlPublicada: "https://cdd.polakgrupo.com/AppIA/tablero/Simpol/index.html",
    observaciones: "Despliegue de la aplicación Simpol completado con éxito a partir de deploy_Simpol.zip y publicado correctamente en IIS.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "15/9/2026 11:20:39",
    emailUsuario: "gustavo.martinez@polakgrupo.com",
    nombreApp: "SICD",
    objetivo: "Sisetma",
    emailContacto: "gustavo.martinez@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1CFH-KaMWkzYtKiSs4drlo1M4pEqtuoLL",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML (index.html incluido), CSS y JavaScript (sin código de servidor, sin ejecutables)",
    tipoSolicitud: "Nueva aplicación",
    versionApp: "1",
    areaDepartamento: "Otro",
    descripcionCambios: "",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "15/09/2026 11:21",
    urlPublicada: "https://cdd.polakgrupo.com/AppIA/tablero/SICD/index.html",
    observaciones: "Despliegue de la aplicación SICD completado exitosamente en IIS a partir del archivo deploy_SICD.zip.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "15/9/2026 12:47:06",
    emailUsuario: "gustavo.martinez@polakgrupo.com",
    nombreApp: "CulturaTaxonomia",
    objetivo: "Difundir la cultura",
    emailContacto: "beatriz.mejia@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1fR20Y6uxuqr5-ozqnSAJ6ULPZluM-o_u",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML (index.html incluido), CSS y JavaScript (sin código de servidor, sin ejecutables)",
    tipoSolicitud: "Nueva aplicación",
    versionApp: "1",
    areaDepartamento: "Recursos Humanos",
    descripcionCambios: "",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "15/09/2026 12:51",
    urlPublicada: "https://cdd.polakgrupo.com/AppIA/tablero/CulturaTaxonomia/index.html",
    observaciones: "Despliegue exitoso de CulturaTaxonomia en IIS desde el archivo deploy_CulturaTaxonomia.zip.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  },
  {
    marcaTemporal: "15/9/2026 12:48:39",
    emailUsuario: "dileri.lorenzo@polakgrupo.com",
    nombreApp: "JuegosWich",
    objetivo: "Reforzar el conocimiento de los conceptos Wich",
    emailContacto: "dileri.lorenzo@polakgrupo.com",
    archivoPublicar: "https://drive.google.com/open?id=1syiBsoykeaQ2LgFSrvj7ca_V-Y2AIQfO",
    confirmacionContenido: "Confirmo que el ZIP contiene únicamente archivos HTML (index.html incluido), CSS y JavaScript (sin código de servidor, sin ejecutables)",
    tipoSolicitud: "Nueva aplicación",
    versionApp: "1",
    areaDepartamento: "Recursos Humanos",
    descripcionCambios: "",
    politicasPublicacion: "He leído y acepto las políticas de publicación de aplicaciones internas",
    fechaActualizacion: "15/09/2026 12:51",
    urlPublicada: "https://cdd.polakgrupo.com/AppIA/tablero/JuegosWich/index.html",
    observaciones: "Despliegue exitoso de JuegosWich en IIS desde el archivo deploy_JuegosWich.zip.",
    estatus: "PROCESO FINALIZADO CORRECTAMENTE"
  }
];

export const DRIVE_FOLDER_ID = "13M1TsbGlAcgmlk66V4DM3YJe_tzPk8e0vLXCDUdVNF0dPV9h7MbtaVgMY1VAeTQUqtTPqL3a";
export const DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;
