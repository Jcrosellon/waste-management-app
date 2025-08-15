// Interfaces que coinciden exactamente con el backend
export interface Usuario {
  id: number
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  rol: "Usuario" | "Recolector" | "Administrador"
  puntos: number
  fechaRegistro: string
  activo: boolean
  localidadId?: number
  fotoUrl?: string | null;
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegistroRequest {
  nombre: string
  email: string
  password: string
  rol?: string
  telefono?: string
  direccion?: string
  localidadId?: number
}

export interface LoginResponse {
  token: string
}

// Alias para compatibilidad
export interface UsuarioProfile extends Usuario {}
