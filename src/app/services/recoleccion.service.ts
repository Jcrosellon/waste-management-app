import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Recoleccion, 
  RecoleccionDto, 
  CreateRecoleccionRequest, 
  UpdateRecoleccionRequest 
} from '../models/recoleccion.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

export interface RecoleccionFilters {
  tipoResiduoId?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  esValida?: boolean;
  usuarioId?: number;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecoleccionService {
  private readonly apiUrl = `${environment.apiUrl}/recolecciones`;

  constructor(private http: HttpClient) {}

  getRecolecciones(filters?: RecoleccionFilters): Observable<ApiResponse<PaginatedResponse<RecoleccionDto>>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.tipoResiduoId) params = params.set('tipoResiduoId', filters.tipoResiduoId.toString());
      if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
      if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
      if (filters.esValida !== undefined) params = params.set('esValida', filters.esValida.toString());
      if (filters.usuarioId) params = params.set('usuarioId', filters.usuarioId.toString());
      if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<RecoleccionDto>>>(this.apiUrl, { params });
  }

  getRecoleccionById(id: number): Observable<ApiResponse<RecoleccionDto>> {
    return this.http.get<ApiResponse<RecoleccionDto>>(`${this.apiUrl}/${id}`);
  }

  getMisRecolecciones(filters?: RecoleccionFilters): Observable<ApiResponse<PaginatedResponse<RecoleccionDto>>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.tipoResiduoId) params = params.set('tipoResiduoId', filters.tipoResiduoId.toString());
      if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString());
      if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString());
      if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<RecoleccionDto>>>(`${this.apiUrl}/mis-recolecciones`, { params });
  }

  createRecoleccion(recoleccion: CreateRecoleccionRequest): Observable<ApiResponse<RecoleccionDto>> {
    return this.http.post<ApiResponse<RecoleccionDto>>(this.apiUrl, recoleccion);
  }

  updateRecoleccion(recoleccion: UpdateRecoleccionRequest): Observable<ApiResponse<RecoleccionDto>> {
    return this.http.put<ApiResponse<RecoleccionDto>>(`${this.apiUrl}/${recoleccion.id}`, recoleccion);
  }

  deleteRecoleccion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  validarRecoleccion(id: number): Observable<ApiResponse<RecoleccionDto>> {
    return this.http.patch<ApiResponse<RecoleccionDto>>(`${this.apiUrl}/${id}/validar`, {});
  }

  rechazarRecoleccion(id: number, motivo?: string): Observable<ApiResponse<RecoleccionDto>> {
    return this.http.patch<ApiResponse<RecoleccionDto>>(`${this.apiUrl}/${id}/rechazar`, { motivo });
  }

  getEstadisticas(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estadisticas`);
  }

  getEstadisticasUsuario(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/estadisticas/usuario`);
  }
}
