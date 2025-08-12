import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioProfile } from '../models/usuario.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

export interface UsuarioFilters {
  nombre?: string;
  email?: string;
  rol?: string;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getUsuarios(filters?: UsuarioFilters): Observable<ApiResponse<PaginatedResponse<UsuarioProfile>>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.nombre) params = params.set('nombre', filters.nombre);
      if (filters.email) params = params.set('email', filters.email);
      if (filters.rol) params = params.set('rol', filters.rol);
      if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<UsuarioProfile>>>(this.apiUrl, { params });
  }

  getUsuarioById(id: number): Observable<ApiResponse<UsuarioProfile>> {
    return this.http.get<ApiResponse<UsuarioProfile>>(`${this.apiUrl}/${id}`);
  }

  updateUsuario(id: number, usuario: Partial<UsuarioProfile>): Observable<ApiResponse<UsuarioProfile>> {
    return this.http.put<ApiResponse<UsuarioProfile>>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  updatePuntos(id: number, puntos: number): Observable<ApiResponse<UsuarioProfile>> {
    return this.http.patch<ApiResponse<UsuarioProfile>>(`${this.apiUrl}/${id}/puntos`, { puntos });
  }

  getProfile(): Observable<ApiResponse<UsuarioProfile>> {
    return this.http.get<ApiResponse<UsuarioProfile>>(`${this.apiUrl}/profile`);
  }

  updateProfile(usuario: Partial<UsuarioProfile>): Observable<ApiResponse<UsuarioProfile>> {
    return this.http.put<ApiResponse<UsuarioProfile>>(`${this.apiUrl}/profile`, usuario);
  }
}
