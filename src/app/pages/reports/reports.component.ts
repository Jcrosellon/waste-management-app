import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ReportesService, ReporteUsuario, ReporteLocalidad } from "../../services/reportes.service"
import { AuthService } from "../../services/auth.service"
import { type Observable, map } from "rxjs"

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit {
  tipoReporte: "usuario" | "localidad" = "usuario"
  usuarioId: number | null = null
  localidadId: number | null = null
  fechaDesde = ""
  fechaHasta = ""

  reporteUsuario: ReporteUsuario | null = null
  reporteLocalidad: ReporteLocalidad | null = null
  localidades: Array<{ id: number; nombre: string }> = []

  loading = false
  error: string | null = null

  isAdmin$: Observable<boolean>
  isRecolector$: Observable<boolean>
  currentUserId$: Observable<number | null>

  constructor(
    private reportesService: ReportesService,
    public authService: AuthService,
  ) {
    this.isAdmin$ = this.authService.currentUser$.pipe(map((user) => user?.rol === "Administrador"))

    this.isRecolector$ = this.authService.currentUser$.pipe(
      map((user) => user?.rol === "Recolector" || user?.rol === "Administrador"),
    )

    this.currentUserId$ = this.authService.currentUser$.pipe(map((user) => user?.id || null))
  }

  ngOnInit(): void {
    this.loadLocalidades()

    this.currentUserId$.subscribe((userId) => {
      if (userId) {
        this.usuarioId = userId
        this.authService.currentUser$.subscribe((user) => {
          if (user?.rol === "Usuario") {
            this.generarReporte()
          }
        })
      }
    })
  }

  loadLocalidades(): void {
    this.reportesService.getLocalidades().subscribe({
      next: (localidades) => {
        this.localidades = localidades
      },
      error: (error) => {
        console.error("Error cargando localidades:", error)
      },
    })
  }

  generarReporte(): void {
    if (!this.validarFiltros()) return

    this.loading = true
    this.error = null
    this.reporteUsuario = null
    this.reporteLocalidad = null

    const fechaDesde = this.fechaDesde ? new Date(this.fechaDesde) : undefined
    const fechaHasta = this.fechaHasta ? new Date(this.fechaHasta) : undefined

    if (this.tipoReporte === "usuario" && this.usuarioId) {
      this.reportesService.getReporteUsuario(this.usuarioId, fechaDesde, fechaHasta).subscribe({
        next: (reporte) => {
          this.reporteUsuario = reporte
          this.loading = false
        },
        error: (error) => {
          this.error = "Error generando reporte de usuario: " + (error.error?.mensaje || error.message)
          this.loading = false
        },
      })
    } else if (this.tipoReporte === "localidad" && this.localidadId) {
      this.reportesService.getReporteLocalidad(this.localidadId, fechaDesde, fechaHasta).subscribe({
        next: (reporte) => {
          this.reporteLocalidad = reporte
          this.loading = false
        },
        error: (error) => {
          this.error = "Error generando reporte de localidad: " + (error.error?.mensaje || error.message)
          this.loading = false
        },
      })
    }
  }

  validarFiltros(): boolean {
    if (this.tipoReporte === "usuario" && !this.usuarioId) {
      this.error = "Debe seleccionar un usuario"
      return false
    }

    if (this.tipoReporte === "localidad" && !this.localidadId) {
      this.error = "Debe seleccionar una localidad"
      return false
    }

    return true
  }

  exportarReporte(): void {
    if (!this.usuarioId || this.tipoReporte !== "usuario") return

    const fechaDesde = this.fechaDesde ? new Date(this.fechaDesde) : undefined
    const fechaHasta = this.fechaHasta ? new Date(this.fechaHasta) : undefined

    this.reportesService.exportarReporteUsuario(this.usuarioId, "csv", fechaDesde, fechaHasta).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `reporte_usuario_${this.usuarioId}.csv`
        link.click()
        window.URL.revokeObjectURL(url)
      },
      error: (error) => {
        this.error = "Error exportando reporte: " + (error.error?.mensaje || error.message)
      },
    })
  }

  limpiarFiltros(): void {
    this.fechaDesde = ""
    this.fechaHasta = ""
    this.error = null
    this.reporteUsuario = null
    this.reporteLocalidad = null
  }
}
