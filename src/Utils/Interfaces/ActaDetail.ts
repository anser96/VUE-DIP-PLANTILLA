import { Sesion } from "./Sesion";

// Acta.ts
export interface ActaDetail {
    idActa: number;
    numeroActa: number;
    estado: string;
    sesionId: number;
    sesion: Sesion;
  }
  