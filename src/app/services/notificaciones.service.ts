import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"

export interface Notificacion {
  id: number
  usuarioId: number
  tipo: "WhatsApp" | "Sistema" | "Email"
  mensaje: string
  fechaEnvio: string
  estado: "Enviado" | "Pendiente" | "Error"
  telefono?: string
  intentos: number
  errorMensaje?: string
}

export interface EnviarNotificacionRequest {
  usuarioId: number
  tipo: "WhatsApp" | "Sistema" | "Email"
  mensaje: string
  telefono?: string
}

@Injectable({
  providedIn: "root",
})
export class NotificacionesService {
  private readonly apiUrl = `${environment.apiUrl}/Notificaciones`

  constructor(private http: HttpClient) {}

  getNotificacionesUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/usuario/${usuarioId}`)
  }

  enviarNotificacion(request: EnviarNotificacionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar`, request)
  }

  testWhatsApp(telefono: string, mensaje: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/test-whatsapp`, { telefono, mensaje })
  }
}
