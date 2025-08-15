import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

export interface ProgramarRecoleccionRequest {
  tipoResiduoId: number
  subtipo?: string
  pesoEstimado: number
  fechaSolicitud: string
  observaciones?: string
}

export interface Recoleccion {
  id: number
  usuarioId: number
  tipoResiduoId: number
  tipoResiduoNombre: string
  subtipo?: string
  pesoEstimado: number
  pesoReal?: number
  fechaSolicitud: string
  fechaRecoleccion?: string
  estado: string
  observaciones?: string
  puntos: number
}

@Injectable({
  providedIn: "root",
})
export class RecoleccionesService {
  private readonly apiUrl = `${environment.apiUrl}/Recolecciones`

  constructor(private http: HttpClient) {}

  programarRecoleccion(request: ProgramarRecoleccionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/programar`, request)
  }

  getHistorialRecolecciones(): Observable<Recoleccion[]> {
    return this.http.get<Recoleccion[]>(`${this.apiUrl}/historial`)
  }
}
