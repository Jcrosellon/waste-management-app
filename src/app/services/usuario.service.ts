import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { environment } from "../../environments/environment"
import type { UsuarioProfile } from "../models/usuario.model"
import type { ApiResponse, PaginatedResponse } from "../models/api-response.model"

export interface UsuarioFilters {
  nombre?: string
  email?: string
  rol?: string
  pageNumber?: number
  pageSize?: number
}

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/Usuarios`

  constructor(private http: HttpClient) { }

  getUsuarios(filters?: UsuarioFilters): Observable<ApiResponse<PaginatedResponse<UsuarioProfile>>> {
    let params = new HttpParams()

    if (filters) {
      if (filters.nombre) params = params.set("nombre", filters.nombre)
      if (filters.email) params = params.set("email", filters.email)
      if (filters.rol) params = params.set("rol", filters.rol)
      if (filters.pageNumber) params = params.set("pageNumber", filters.pageNumber.toString())
      if (filters.pageSize) params = params.set("pageSize", filters.pageSize.toString())
    }

    return this.http.get<UsuarioProfile[]>(this.apiUrl, { params }).pipe(
      map((data) => ({
        data: { items: data, totalCount: data.length, pageNumber: 1, pageSize: 10, totalPages: 1 },
        success: true,
      })),
    )
  }

  getUsuarioById(id: number): Observable<ApiResponse<UsuarioProfile>> {
    return this.http.get<UsuarioProfile>(`${this.apiUrl}/${id}`).pipe(map((data) => ({ data, success: true })))
  }

  updateUsuario(id: number, usuario: Partial<UsuarioProfile>): Observable<ApiResponse<UsuarioProfile>> {
    return this.http.put<UsuarioProfile>(`${this.apiUrl}/${id}`, usuario).pipe(map((data) => ({ data, success: true })))
  }

  deleteUsuario(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(map(() => ({ data: undefined as any, success: true })))
  }

  updatePuntos(id: number, puntos: number): Observable<ApiResponse<UsuarioProfile>> {
    return this.http
      .patch<UsuarioProfile>(`${this.apiUrl}/${id}/puntos`, { puntos })
      .pipe(map((data) => ({ data, success: true })))
  }

  getProfile(): Observable<ApiResponse<UsuarioProfile>> {
    return this.http.get<UsuarioProfile>(`${this.apiUrl}/perfil`).pipe(map((data) => ({ data, success: true })))
  }

  updateProfile(usuario: Partial<UsuarioProfile>): Observable<ApiResponse<UsuarioProfile>> {
    return this.http
      .put<UsuarioProfile>(`${this.apiUrl}/perfil`, usuario)
      .pipe(map((data) => ({ data, success: true })))
  }

  // src/app/services/usuario.service.ts
  approveUsuario(id: number) {
    return this.http.patch<UsuarioProfile>(`${this.apiUrl}/${id}/aprobar`, {})
      .pipe(map((data) => ({ data, success: true })));
  }

  rejectUsuario(id: number) {
    return this.http.patch<UsuarioProfile>(`${this.apiUrl}/${id}/rechazar`, {})
      .pipe(map((data) => ({ data, success: true })));
  }

}
