import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http" // Cambié de type import a import regular
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

export interface Canje {
  id: number
  usuarioId: number
  descuentoId: number
  puntosUtilizados: number
  codigoCanje: string
  fechaCanje: string
  fechaVencimiento: string
  utilizado: boolean
  fechaUso?: string
  descuento?: {
    id: number
    nombre: string
    descripcion: string
    puntosRequeridos: number
    porcentajeDescuento: number
    empresa: string
  }
}

export interface RealizarCanjeRequest {
  descuentoId: number
}

export interface UtilizarCanjeRequest {
  codigoCanje: string
}

@Injectable({
  providedIn: "root",
})
export class CanjesService {
  private readonly apiUrl = `${environment.apiUrl}/Canjes`

  constructor(private http: HttpClient) {}

  realizarCanje(request: RealizarCanjeRequest): Observable<Canje> {
    return this.http.post<Canje>(`${this.apiUrl}/realizar`, request)
  }

  obtenerCanjesUsuario(usuarioId: number): Observable<Canje[]> {
    return this.http.get<Canje[]>(`${this.apiUrl}/usuario/${usuarioId}`)
  }

  getHistorialCanjes(usuarioId: number): Observable<Canje[]> {
    return this.obtenerCanjesUsuario(usuarioId)
  }

  utilizarCanje(request: UtilizarCanjeRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/utilizar`, request)
  }

  validarCanje(codigoCanje: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/validar/${codigoCanje}`)
  }
}
