import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { map } from 'rxjs/operators';

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

 getLocalidades(): Observable<Localidad[]> {
  return this.http.get<any>(`${environment.apiUrl}/Localidades`).pipe(
    map(r => r?.data?.items ?? r?.items ?? r ?? []),
    map((arr: any[]) => arr.map(l => ({
      id: l.id ?? l.Id ?? l.localidadId,
      nombre: l.nombre ?? l.name ?? 'Sin nombre',
      ciudad: l.ciudad ?? l.city ?? '',
      departamento: l.departamento ?? l.department ?? '',
      activa: l.activa ?? l.active ?? true,
    })))
  );
}

getTiposResiduo(): Observable<TipoResiduo[]> {
  return this.http.get<any>(`${environment.apiUrl}/TiposResiduo`).pipe(
    map(r => r?.data?.items ?? r?.items ?? r ?? []),
    map((arr: any[]) => arr.map(t => ({
      id: t.id ?? t.Id ?? t.tipoResiduoId,
      nombre: t.nombre ?? t.name ?? 'Sin nombre',
      descripcion: t.descripcion ?? t.description ?? '',
      activo: t.activo ?? t.active ?? true,
    })))
  );
}
}
