import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

export interface Descuento {
  id: number
  nombre: string
  descripcion: string
  puntosRequeridos: number
  valorDescuento: number
  esPorcentaje: boolean
  fechaInicio: string
  fechaFin: string
  activo: boolean
  cantidadDisponible: number
  cantidadCanjeada: number
  puedeCanjearse: boolean
}

export interface CrearDescuentoRequest {
  nombre: string
  descripcion: string
  puntosRequeridos: number
  valorDescuento: number
  esPorcentaje: boolean
  fechaInicio: string
  fechaFin: string
  cantidadDisponible: number
}

export interface ActualizarDescuentoRequest {
  nombre?: string
  descripcion?: string
  puntosRequeridos?: number
  valorDescuento?: number
  esPorcentaje?: boolean
  fechaInicio?: string
  fechaFin?: string
  activo?: boolean
  cantidadDisponible?: number
}

@Injectable({
  providedIn: "root",
})
export class DescuentosService {
  private readonly apiUrl = `${environment.apiUrl}/Descuentos`

  constructor(private http: HttpClient) {}

  getDescuentos(): Observable<Descuento[]> {
    return this.http.get<Descuento[]>(this.apiUrl)
  }

  getDescuentosDisponibles(usuarioId: number): Observable<Descuento[]> {
    return this.http.get<Descuento[]>(`${this.apiUrl}/disponibles/${usuarioId}`)
  }

  getDescuento(id: number): Observable<Descuento> {
    return this.http.get<Descuento>(`${this.apiUrl}/${id}`)
  }

  crearDescuento(descuento: CrearDescuentoRequest): Observable<Descuento> {
    return this.http.post<Descuento>(this.apiUrl, descuento)
  }

  actualizarDescuento(id: number, descuento: ActualizarDescuentoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, descuento)
  }

  eliminarDescuento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
