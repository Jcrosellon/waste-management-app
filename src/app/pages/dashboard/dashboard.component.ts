import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DashboardService, DashboardMetrics } from "../../services/dashboard.service";
import { AuthService } from "../../services/auth.service";
import { Observable, map, catchError, of } from "rxjs";

type MetricsWithOptionals = DashboardMetrics & {
  tendenciaRecolecciones?: any[];
  tiposResiduoMasRecolectados?: any[];
  actividadReciente?: {
    recoleccionesRecientes?: any[];
    nuevosUsuarios?: any[];
    canjesRecientes?: any[];
  };
};

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  dashboardData$!: Observable<MetricsWithOptionals>;
  isAdmin$: Observable<boolean>;
  isRecolector$: Observable<boolean>;
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
  ) {
    this.isAdmin$ = this.authService.currentUser$.pipe(map((user) => user?.rol === "Administrador"));
    this.isRecolector$ = this.authService.currentUser$.pipe(
      map((user) => user?.rol === "Recolector" || user?.rol === "Administrador"),
    );
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private withDefaults = (d: MetricsWithOptionals): MetricsWithOptionals => ({
    ...d,
    tendenciaRecolecciones: d.tendenciaRecolecciones ?? [],
    tiposResiduoMasRecolectados: d.tiposResiduoMasRecolectados ?? [],
    actividadReciente: {
      recoleccionesRecientes: d.actividadReciente?.recoleccionesRecientes ?? [],
      nuevosUsuarios: d.actividadReciente?.nuevosUsuarios ?? [],
      canjesRecientes: d.actividadReciente?.canjesRecientes ?? [],
    },
  });

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardData$ = this.dashboardService.getDashboardMetrics().pipe(
      map((d) => this.withDefaults(d as MetricsWithOptionals)),
      catchError((err) => {
        console.error("Error loading dashboard:", err);
        this.error = "Error al cargar los datos del dashboard";
        this.loading = false;
        return of({
          totalUsuarios: 0,
          usuariosActivos: 0,
          totalRecolecciones: 0,
          recoleccionesHoy: 0,
          totalPuntos: 0,
          totalCanjes: 0,
          tendenciaRecolecciones: [],
          tiposResiduoMasRecolectados: [],
          actividadReciente: {
            recoleccionesRecientes: [],
            nuevosUsuarios: [],
            canjesRecientes: [],
          },
        } as MetricsWithOptionals);
      })
    );

    // mantener los flags de loading/error sincronizados
    this.dashboardData$.subscribe({
      next: () => (this.loading = false),
      error: () => (this.loading = false),
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
