import { Recoleccion } from "./recoleccion.model";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
  rol: string;
  puntos: number;
  recolecciones: Recoleccion[];
}

export interface RegistroRequest {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  expiresAt: string;
}

export interface UsuarioProfile {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  puntos: number;
}
