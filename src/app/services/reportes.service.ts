import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../environments/environment"

export interface ReporteUsuario {
  usuario: {
    id: number
    nombre: string
    email: string
    puntos: number
    fechaRegistro: string
    localidad: string
  }
  totalRecolecciones: number
  pesoTotalKg: number
  puntosTotales: number
  totalCanjes: number
  puntosCanjeados: number
  recoleccionesPorTipo: Array<{
    tipoResiduo: string
    cantidad: number
    pesoTotal: number
    puntosTotal: number
  }>
  historialRecolecciones: Array<{
    id: number
    fecha: string
    tipoResiduo: string
    subtipo?: string
    pesoKg?: number
    puntosGanados: number
    estado: string
  }>
}

export interface ReporteLocalidad {
  localidad: {
    id: number
    nombre: string
    ciudad: string
    departamento: string
  }
  totalUsuarios: number
  usuariosActivos: number
  totalRecolecciones: number
  pesoTotalKg: number
  puntosTotales: number
  recoleccionesPorTipo: Array<{
    tipoResiduo: string
    cantidad: number
    pesoTotal: number
    puntosTotal: number
  }>
  topUsuarios: Array<{
    id: number
    nombre: string
    puntos: number
    totalRecolecciones: number
  }>
}

@Injectable({
  providedIn: "root",
})
export class ReportesService {
  private readonly apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getReporteUsuario(usuarioId: number, fechaDesde?: Date, fechaHasta?: Date): Observable<ReporteUsuario> {
    let params = new HttpParams()
    if (fechaDesde) {
      params = params.set("fechaDesde", fechaDesde.toISOString())
    }
    if (fechaHasta) {
      params = params.set("fechaHasta", fechaHasta.toISOString())
    }

    return this.http.get<ReporteUsuario>(`${this.apiUrl}/Reportes/usuario/${usuarioId}`, { params })
  }

  getReporteLocalidad(localidadId: number, fechaDesde?: Date, fechaHasta?: Date): Observable<ReporteLocalidad> {
    let params = new HttpParams()
    if (fechaDesde) {
      params = params.set("fechaDesde", fechaDesde.toISOString())
    }
    if (fechaHasta) {
      params = params.set("fechaHasta", fechaHasta.toISOString())
    }

    return this.http.get<ReporteLocalidad>(`${this.apiUrl}/Reportes/localidad/${localidadId}`, { params })
  }

  exportarReporteUsuario(
    usuarioId: number,
    formato: "json" | "csv" = "csv",
    fechaDesde?: Date,
    fechaHasta?: Date,
  ): Observable<Blob> {
    let params = new HttpParams().set("formato", formato)
    if (fechaDesde) {
      params = params.set("fechaDesde", fechaDesde.toISOString())
    }
    if (fechaHasta) {
      params = params.set("fechaHasta", fechaHasta.toISOString())
    }

    return this.http.get(`${this.apiUrl}/Reportes/exportar/usuario/${usuarioId}`, {
      params,
      responseType: "blob",
    })
  }

  getLocalidades(): Observable<Array<{ id: number; nombre: string }>> {
    return this.http.get<Array<{ id: number; nombre: string }>>(`${this.apiUrl}/Localidades`)
  }
}
