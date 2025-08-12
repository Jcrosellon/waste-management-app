export interface TipoResiduo {
  id: number;
  nombre: string;
  puntos: number;
  recolecciones?: Recoleccion[];
}

export interface CreateTipoResiduoRequest {
  nombre: string;
  puntos: number;
}

export interface UpdateTipoResiduoRequest {
  id: number;
  nombre: string;
  puntos: number;
}

// Import necesario
import { Recoleccion } from './recoleccion.model';
