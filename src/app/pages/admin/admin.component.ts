import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { DashboardService, type DashboardMetrics } from "../../services/dashboard.service";
import { HttpErrorResponse } from "@angular/common/http";


interface AdminStats {
  totalUsuarios: number
  usuariosActivos: number
  totalRecolecciones: number
  recoleccionesHoy: number
  totalPuntos: number
  totalCanjes: number
  notificacionesPendientes: number
  descuentosActivos: number
}

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
  stats: AdminStats = {
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalRecolecciones: 0,
    recoleccionesHoy: 0,
    totalPuntos: 0,
    totalCanjes: 0,
    notificacionesPendientes: 0,
    descuentosActivos: 0,
  }

  loading = true
  error: string | null = null

  adminModules = [
    {
      title: "Gestión de Usuarios",
      description: "Administrar usuarios, roles y permisos",
      icon: "users",
      route: "/admin/users",
      color: "blue",
    },
    {
      title: "Reportes y Analytics",
      description: "Ver reportes detallados y métricas del sistema",
      icon: "chart",
      route: "/reports",
      color: "green",
    },
    {
      title: "Gestión de Descuentos",
      description: "Crear y administrar descuentos y promociones",
      icon: "discount",
      route: "/admin/discounts",
      color: "purple",
    },
    {
      title: "Notificaciones",
      description: "Gestionar notificaciones del sistema",
      icon: "bell",
      route: "/notifications",
      color: "yellow",
    },
    {
      title: "Configuración",
      description: "Configurar zonas, reglas y parámetros del sistema",
      icon: "settings",
      route: "/admin/config",
      color: "gray",
    },
    {
      title: "Dashboard General",
      description: "Vista general de métricas y estadísticas",
      icon: "dashboard",
      route: "/dashboard",
      color: "indigo",
    },
  ]

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.loadAdminStats()
  }

  private loadAdminStats(): void {
  this.loading = true;
  this.error = null;

  // ⬇️ usa el nombre correcto del método y tipa 'data' y 'error'
  this.dashboardService.getDashboardMetrics().subscribe({
    next: (data: DashboardMetrics) => {
      this.stats = {
        totalUsuarios: data.totalUsuarios ?? 0,
        usuariosActivos: data.usuariosActivos ?? 0,
        totalRecolecciones: data.totalRecolecciones ?? 0,
        recoleccionesHoy: data.recoleccionesHoy ?? 0,
        totalPuntos: data.totalPuntos ?? 0,
        totalCanjes: data.totalCanjes ?? 0,

        // Estos dos no existen en el DTO del servicio.
        // Si no vienen del backend, déjalos en 0 por ahora.
        notificacionesPendientes: 0,
        descuentosActivos: 0,
      };
      this.loading = false;
    },
    error: (error: HttpErrorResponse | unknown) => {
      console.error("Error loading admin stats:", error);
      this.error = "Error al cargar las estadísticas administrativas";
      this.loading = false;
    },
  });
}


  refreshStats(): void {
    this.loadAdminStats()
  }
}
