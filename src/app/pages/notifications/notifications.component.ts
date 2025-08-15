import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import {
  NotificacionesService,
  Notificacion,
  EnviarNotificacionRequest,
} from "../../services/notificaciones.service"
import { AuthService } from "../../services/auth.service"
import { Usuario } from "../../models/usuario.model"
import { Observable, map } from "rxjs"

@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  notificaciones: Notificacion[] = []
  filtroTipo = "Todos"
  filtroEstado = "Todos"
  loading = false
  error: string | null = null

  // Para enviar notificaciones (solo admin)
  mostrarFormulario = false
  nuevaNotificacion: EnviarNotificacionRequest = {
    usuarioId: 0,
    tipo: "WhatsApp",
    mensaje: "",
    telefono: "",
  }

  // Observables para roles
  isAdmin$: Observable<boolean>
  currentUser$: Observable<Usuario | null>
  trackByNotificacion(index: number, n: Notificacion): number | string {
  // Usa un id estable si tu modelo lo tiene; cae al índice si no.
  // Ajusta 'id' por el campo único que tengas (p.ej. n.idNotificacion).
  return (n as any).id ?? index;
}


  constructor(
    private notificacionesService: NotificacionesService,
    public authService: AuthService,
  ) {
    this.isAdmin$ = this.authService.currentUser$.pipe(map((user) => user?.rol === "Administrador"))
    this.currentUser$ = this.authService.currentUser$
  }

  ngOnInit(): void {
    this.cargarNotificaciones()
  }

  cargarNotificaciones(): void {
    this.loading = true
    this.error = null

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.notificacionesService.getNotificacionesUsuario(user.id).subscribe({
          next: (notificaciones) => {
            this.notificaciones = notificaciones
            this.loading = false
          },
          error: (error) => {
            this.error = "Error al cargar las notificaciones"
            this.loading = false
            console.error("Error:", error)
          },
        })
      }
    })
  }

  get notificacionesFiltradas(): Notificacion[] {
    return this.notificaciones.filter((notif) => {
      const cumpleTipo = this.filtroTipo === "Todos" || notif.tipo === this.filtroTipo
      const cumpleEstado = this.filtroEstado === "Todos" || notif.estado === this.filtroEstado
      return cumpleTipo && cumpleEstado
    })
  }

  enviarNotificacion(): void {
    if (!this.nuevaNotificacion.mensaje.trim()) {
      this.error = "El mensaje es requerido"
      return
    }

    this.loading = true
    this.notificacionesService.enviarNotificacion(this.nuevaNotificacion).subscribe({
      next: () => {
        this.mostrarFormulario = false
        this.resetFormulario()
        this.cargarNotificaciones()
        this.loading = false
      },
      error: (error) => {
        this.error = "Error al enviar la notificación"
        this.loading = false
        console.error("Error:", error)
      },
    })
  }

  testWhatsApp(): void {
    if (!this.nuevaNotificacion.telefono || !this.nuevaNotificacion.mensaje) {
      this.error = "Teléfono y mensaje son requeridos para la prueba"
      return
    }

    this.loading = true
    this.notificacionesService.testWhatsApp(this.nuevaNotificacion.telefono, this.nuevaNotificacion.mensaje).subscribe({
      next: () => {
        this.error = null
        this.loading = false
        alert("Mensaje de prueba enviado correctamente")
      },
      error: (error) => {
        this.error = "Error al enviar mensaje de prueba"
        this.loading = false
        console.error("Error:", error)
      },
    })
  }

  resetFormulario(): void {
    this.nuevaNotificacion = {
      usuarioId: 0,
      tipo: "WhatsApp",
      mensaje: "",
      telefono: "",
    }
    this.error = null
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString("es-ES")
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case "Enviado":
        return "status-success"
      case "Pendiente":
        return "status-warning"
      case "Error":
        return "status-error"
      default:
        return ""
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case "WhatsApp":
        return "📱"
      case "Email":
        return "📧"
      case "Sistema":
        return "🔔"
      default:
        return "📄"
    }
  }
}
