import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

export interface TipoResiduo {
  id: number
  nombre: string
  descripcion?: string
  puntos: number
  color?: string
  activo: boolean
}

@Injectable({
  providedIn: "root",
})
export class TiposResiduoService {
  private readonly apiUrl = `${environment.apiUrl}/TiposResiduo`

  constructor(private http: HttpClient) {}

  getTiposResiduo(): Observable<TipoResiduo[]> {
    return this.http.get<TipoResiduo[]>(this.apiUrl)
  }

  getTipoResiduo(id: number): Observable<TipoResiduo> {
    return this.http.get<TipoResiduo>(`${this.apiUrl}/${id}`)
  }
}
