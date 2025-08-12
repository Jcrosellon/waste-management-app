export interface Recoleccion {
  id: number;
  tipoResiduoId: number;
  tipoResiduo?: TipoResiduo;
  subtipo?: string;
  fecha: Date;
  pesoKg?: number;
  esValida: boolean;
  usuarioId: number;
  usuario?: Usuario;
  puntosGanados: number;
}

export interface RecoleccionDto {
  id: number;
  tipoResiduo: string;
  subtipo?: string;
  fecha: Date;
  pesoKg?: number;
  esValida: boolean;
  puntosGanados: number;
}

export interface CreateRecoleccionRequest {
  tipoResiduoId: number;
  subtipo?: string;
  fecha: Date;
  pesoKg?: number;
}

export interface UpdateRecoleccionRequest {
  id: number;
  tipoResiduoId: number;
  subtipo?: string;
  fecha: Date;
  pesoKg?: number;
  esValida: boolean;
}

// Import necesario para evitar referencias circulares
import { Usuario } from './usuario.model';
import { TipoResiduo } from './tipo-residuo.model';
