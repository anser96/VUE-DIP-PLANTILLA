
// Acta.ts
export interface ActaDetail {
    idActa: number;
    numeroActa: number;
    estado: string;
    sesionId: number;
    sesion: Sesion;
  }
  
  // Sesion.ts
export interface Sesion {
  idSesion: number;
  lugar: string;
  fecha: string; // "2024-11-02"
  contenido: string;
  horaInicio: Hora;
  horaFinal: Hora;
  presidente: string;
  secretario: string;
  asistenciaMiembros: AsistenciaMiembro[];
  asistenciaInvitados: AsistenciaInvitado[];
  actas: string[];
  tareas: Tarea[];
}

export interface Hora {
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
  
  export interface Acta {
    idActa: number;
    estado: string;
    sesionId: number;
  }
