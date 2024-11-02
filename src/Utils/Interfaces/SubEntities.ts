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
  