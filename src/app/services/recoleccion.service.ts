import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../environments/environment";

// ===== Request que espera tu BE =====
export interface ProgramarRecoleccionRequest {
  tipoResiduoId: number;
  subtipo?: string;
  pesoEstimado: number;
  fechaSolicitud: string; // ISO
  observaciones?: string;
}

// ===== Respuesta cruda del BE (RecoleccionDto - camelCase) =====
interface RecoleccionApi {
  id: number;
  tipoResiduo: string;
  subtipo?: string | null;
  fecha: string;           // ISO
  pesoKg?: number | null;
  esValida: boolean;
  puntosGanados: number;
}

// ===== Modelo que usará la UI =====
export interface RecoleccionUI {
  id: number;
  tipoResiduoNombre: string;
  fechaSolicitud: string;  // ISO
  estado: string;          // "Completada" | "Programada" (o lo que definas)
  puntos: number;
  pesoEstimado: number;    // desde pesoKg (o 0 si null)
  subtipo?: string;
}

@Injectable({ providedIn: "root" })
export class RecoleccionesService {
  private readonly apiUrl = `${environment.apiUrl}/Recolecciones`;

  constructor(private http: HttpClient) {}

  programarRecoleccion(request: ProgramarRecoleccionRequest): Observable<RecoleccionUI> {
    // ¡OJO! Enviamos tal cual el DTO que pide el BE
    return this.http.post<RecoleccionApi>(`${this.apiUrl}/programar`, request).pipe(
      map(api => this.toUI(api))
    );
  }

  getHistorialRecolecciones(): Observable<RecoleccionUI[]> {
    return this.http.get<RecoleccionApi[]>(`${this.apiUrl}/historial`).pipe(
      map(list => list.map(api => this.toUI(api)))
    );
  }

  // --- Mapper BE -> UI ---
  private toUI(api: RecoleccionApi): RecoleccionUI {
    return {
      id: api.id,
      tipoResiduoNombre: api.tipoResiduo,
      fechaSolicitud: api.fecha,
      estado: api.esValida ? "Completada" : "Programada",
      puntos: api.puntosGanados,
      pesoEstimado: api.pesoKg ?? 0,
      subtipo: api.subtipo ?? undefined,
    };
  }
}
