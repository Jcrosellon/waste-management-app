import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoResiduo, CreateTipoResiduoRequest, UpdateTipoResiduoRequest } from '../models/tipo-residuo.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TipoResiduoService {
  private readonly apiUrl = `${environment.apiUrl}/tipos-residuo`;

  constructor(private http: HttpClient) {}

  getTiposResiduo(): Observable<ApiResponse<TipoResiduo[]>> {
    return this.http.get<ApiResponse<TipoResiduo[]>>(this.apiUrl);
  }

  getTipoResiduoById(id: number): Observable<ApiResponse<TipoResiduo>> {
    return this.http.get<ApiResponse<TipoResiduo>>(`${this.apiUrl}/${id}`);
  }

  createTipoResiduo(tipoResiduo: CreateTipoResiduoRequest): Observable<ApiResponse<TipoResiduo>> {
    return this.http.post<ApiResponse<TipoResiduo>>(this.apiUrl, tipoResiduo);
  }

  updateTipoResiduo(tipoResiduo: UpdateTipoResiduoRequest): Observable<ApiResponse<TipoResiduo>> {
    return this.http.put<ApiResponse<TipoResiduo>>(`${this.apiUrl}/${tipoResiduo.id}`, tipoResiduo);
  }

  deleteTipoResiduo(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
