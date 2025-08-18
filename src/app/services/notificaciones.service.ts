import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../environments/environment";

export interface Notificacion {
  id: number;
  usuarioId: number;
  tipo: "WhatsApp" | "Sistema" | "Email";
  mensaje: string;
  fechaEnvio: string;
  estado: "Enviado" | "Pendiente" | "Error";
  telefono?: string | null;
  intentos: number;
  errorMensaje?: string | null;
}

export interface EnviarNotificacionRequest {
  usuarioId: number;
  tipo: "WhatsApp" | "Sistema" | "Email";
  mensaje: string;
  telefono?: string;
}

@Injectable({ providedIn: "root" })
export class NotificacionesService {
  private readonly apiUrl = `${environment.apiUrl}/Notificaciones`;

  constructor(private http: HttpClient) {}

  /** Mapear DTO del BE -> modelo del FE */
  private mapDto = (dto: any): Notificacion => ({
    id: dto.id ?? dto.Id,
    usuarioId: dto.usuarioId ?? dto.UsuarioId,
    tipo: (dto.tipo ?? dto.TipoNotificacion ?? "Sistema") as Notificacion["tipo"],
    mensaje: dto.mensaje ?? dto.Mensaje ?? "",
    fechaEnvio: dto.fechaEnvio ?? dto.FechaEnvio ?? new Date().toISOString(),
    estado:
      dto.estado ??
      (dto.Enviada === true ? "Enviado" : dto.Enviada === false ? "Error" : "Pendiente"),
    telefono: dto.telefono ?? dto.NumeroWhatsApp ?? null,
    intentos: dto.intentos ?? dto.Intentos ?? 1,
    errorMensaje: dto.errorMensaje ?? dto.ErrorMensaje ?? null,
  });

  getNotificacionesUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`)
      .pipe(map(arr => (arr ?? []).map(this.mapDto)));
  }

  /** Solo para Admin: devuelve todo el historial, con filtros opcionales */
  getHistorialNotificaciones(filters: {
    usuarioId?: number;
    tipo?: string;
    fechaDesde?: string; // ISO
    fechaHasta?: string; // ISO
  } = {}): Observable<Notificacion[]> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== "") params = params.set(k, String(v));
    }
    return this.http
      .get<any[]>(`${this.apiUrl}/historial`, { params })
      .pipe(map(arr => (arr ?? []).map(this.mapDto)));
  }

  enviarNotificacion(request: EnviarNotificacionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar`, request);
  }

  testWhatsApp(telefono: string, mensaje: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/test-whatsapp`, { telefono, mensaje });
  }
}
