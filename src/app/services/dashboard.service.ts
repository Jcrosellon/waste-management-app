import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

export interface DashboardMetrics {
  totalUsuarios: number
  totalRecolecciones: number
  totalPuntos: number
  totalCanjes: number
  recoleccionesHoy: number
  usuariosActivos: number
  tendenciaRecolecciones: { mes: string; cantidad: number }[]
  tiposResiduoMasRecolectados: { tipo: string; cantidad: number; porcentaje: number }[]
  actividadReciente: {
    recoleccionesRecientes: any[]
    nuevosUsuarios: any[]
    canjesRecientes: any[]
  }
}

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private readonly apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/Reportes/dashboard`)
  }

  getReporteUsuario(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Reportes/usuario/${usuarioId}`)
  }

  getReporteLocalidad(localidadId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Reportes/localidad/${localidadId}`)
  }
}
