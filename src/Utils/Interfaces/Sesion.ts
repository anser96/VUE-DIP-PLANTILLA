// Sesion.ts
import { AsistenciaMiembro, AsistenciaInvitado, Tarea } from './SubEntities';

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
