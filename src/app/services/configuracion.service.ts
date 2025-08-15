import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

export interface ConfiguracionZona {
  id: number
  localidadId: number
  localidadNombre: string
  tipoResiduoId: number
  tipoResiduoNombre: string
  frecuenciaDias: number
  pesoMinimoKg: number
  pesoMaximoKg: number
  horaInicio: string
  horaFin: string
  requiereValidacionFoto: boolean
  activa: boolean
}

export interface ReglaValidacion {
  id: number
  tipoResiduoId: number
  tipoResiduoNombre: string
  localidadId?: number
  localidadNombre?: string
  descripcion: string
  activa: boolean
}

export interface Localidad {
  id: number
  nombre: string
  ciudad: string
  departamento: string
  activa: boolean
}

export interface TipoResiduo {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
}

@Injectable({
  providedIn: "root",
})
export class ConfiguracionService {
  private readonly apiUrl = `${environment.apiUrl}/Configuracion`

  constructor(private http: HttpClient) {}

  // Configuraciones de Zona
  getConfiguracionesZona(): Observable<ConfiguracionZona[]> {
    return this.http.get<ConfiguracionZona[]>(`${this.apiUrl}/zonas`)
  }

  crearConfiguracionZona(configuracion: Partial<ConfiguracionZona>): Observable<ConfiguracionZona> {
    return this.http.post<ConfiguracionZona>(`${this.apiUrl}/zonas`, configuracion)
  }

  // Reglas de Validación
  getReglasValidacion(): Observable<ReglaValidacion[]> {
    return this.http.get<ReglaValidacion[]>(`${this.apiUrl}/reglas`)
  }

  crearReglaValidacion(regla: Partial<ReglaValidacion>): Observable<ReglaValidacion> {
    return this.http.post<ReglaValidacion>(`${this.apiUrl}/reglas`, regla)
  }

  actualizarReglaValidacion(id: number, regla: Partial<ReglaValidacion>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reglas/${id}`, regla)
  }

  // Datos auxiliares
  getLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${environment.apiUrl}/Localidades`)
  }

  getTiposResiduo(): Observable<TipoResiduo[]> {
    return this.http.get<TipoResiduo[]>(`${environment.apiUrl}/TiposResiduo`)
  }
}
