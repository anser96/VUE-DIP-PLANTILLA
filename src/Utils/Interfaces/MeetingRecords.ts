// Acta.ts
export interface Acta {
  idActa: number;
  numeroActa: string;
  estado: string;
  sesion: Sesion;
}

export interface ActaDetail extends Acta {
  sesionId: number;
}
// Sesion.ts
export interface Sesion {
  idSesion: number;
  lugar: string;
  fecha: string; // "2024-11-02"
  contenido: string;
  horaInicio: LocalTime;
  horaFinal: LocalTime;
  presidente: string;
  secretario: string;
  asistenciaMiembros: AsistenciaMiembro[];
  asistenciaInvitados: AsistenciaInvitado[];
  actas: Acta[];
  tareas: Tarea[];
  solicitudes: Solicitud[];
}

export interface LocalTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}
// SubEntities.ts
export interface AsistenciaMiembro {
  idMiembro: number;
  nombre: string;
  cargo: string;
  email: string;
  estadoAsistencia: string;
}

export interface AsistenciaInvitado {
  idInvitado: number;
  nombre: string;
  dependencia: string;
  email: string;
  estadoAsistencia: string;
}
export interface Invitado {
  idInvitado: number;
  nombre: string;
  dependencia: string;
  email: string;
  estadoAsistencia: string;
  asistenciaInvitados: AsistenciaInvitado[]; // Relación con asistencia
}
export interface Tarea {
  idTarea: number;
  descripcion: string;
  fechaEntrega: string; // "2024-11-02"
  fechaVerificacion: string; // "2024-11-02"
  tipoResponsable: string;
  responsableId: number;
  estado: string;
  responsable: any;
}

// SubEntities.ts

export interface Miembro {
  idMiembro: number;
  nombre: string;
  cargo: string;
  email: string;
  excusa?: string; // Add the excusa property
  asistenciaMiembros: AsistenciaMiembro[]; // Relación con asistencia
}
export interface AsistenciaInvitado {
  idInvitado: number;
  nombre: string;
  dependencia: string;
  email: string;
  estadoAsistencia: string;
}

export interface QuorumEntry {
  idPersona: number;
  tipo: 'miembro' | 'invitado';
  estadoAsistencia: 'ASISTIÓ' | 'EXCUSA' | 'NO ASISTIÓ';
  excusa: string;
}

export interface Tarea {
  idTarea: number;
  descripcion: string;
  fechaEntrega: string; // "2024-11-02"
  fechaVerificacion: string; // "2024-11-02"
  tipoResponsable: string;
  responsableId: number;
  estado: string;
  responsable: any;
}

export interface Solicitud {
  idSolicitud: number;
  dependencia: string;
  asunto: string;
  descripcion: string;
  fechaDeSolicitud: string; // date-time
  respuesta: string;
  estado: string;
  tipoSolicitante: string;
  idSolicitante: number;
  nombreSolicitante: string;
}
export interface Descripcion {
  idDescripcion: number;
  estuImplicados: string;
  numEstuImplicados: number;
  docenImplicados: string;
  numDocenImplicados: number;
  cuidadImplicada: string;
  paisImplicado: string;
  evento: string;
}
// ApiResponse.ts
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface ApiResponseSesionDTO extends ApiResponse<Sesion> {}

export interface ApiResponseListSesionDTO extends ApiResponse<Sesion[]> {}

export interface ApiResponseActa extends ApiResponse<Acta> {}

export interface ApiResponseActaDTO extends ApiResponse<ActaDetail> {}

export interface ApiResponseListActaDTO extends ApiResponse<ActaDetail[]> {}

export interface ApiResponseTarea extends ApiResponse<Tarea> {}

export interface ApiResponseListTareaDTO extends ApiResponse<Tarea[]> {}

export interface ApiResponseVoid {
  status: string;
  message: string;
  data: object;
}

export interface ApiResponseString {
  status: string;
  message: string;
  data: string;
}
// Nueva interfaz para la respuesta de login
export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    usuario?: Usuario; // Ajusta esto si el usuario también se devuelve en la respuesta
  };
}

// Mantener la interfaz para los datos de login
export interface LoginData {
  correo: string;
  contrasena: string;
}
export interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  contrasena?: string;
}