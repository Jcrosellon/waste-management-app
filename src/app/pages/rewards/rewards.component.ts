import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject, takeUntil, combineLatest, switchMap, of, firstValueFrom } from "rxjs"; // 👈 añade of y firstValueFrom
import { AuthService } from "../../services/auth.service";
import { DescuentosService } from "../../services/descuentos.service";
import { CanjesService } from "../../services/canjes.service";
import { Usuario } from "../../models/usuario.model";

interface Descuento {
  id: number;
  nombre: string;
  descripcion: string;
  puntosRequeridos: number;
  categoria: string;
  activo: boolean;
  stock: number;
  porcentajeDescuento?: number;
  fechaVencimiento: string;
}

interface Canje {
  id: number;
  descuentoNombre: string;
  puntosUtilizados: number;
  fechaCanje: string;
  codigoCanje: string;
  utilizado: boolean;
}

// 👇 define el tipo de los elementos del array para que no sea "never"
interface WayToEarn {
  action: string;
  points: number;
  icon: string;
  bgColor: string;
}

@Component({
  selector: "app-rewards",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./rewards.component.html",
})
export class RewardsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: Usuario | null = null;
  descuentos: Descuento[] = [];
  canjesRecientes: Canje[] = [];
  filteredDescuentos: Descuento[] = [];
  selectedCategory = "all";
  loading = false;
  error: string | null = null;

  categories = [
    { id: "all", name: "Todos" },
    { id: "productos", name: "Productos Eco" },
    { id: "descuentos", name: "Descuentos" },
    { id: "experiencias", name: "Experiencias" },
    { id: "donaciones", name: "Donaciones" },
  ];

  waysToEarn: WayToEarn[] = [
  {
    action: "Recolección Orgánicos",
    points: 30,
    // check-circle
    icon:
      "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
    bgColor: "bg-green-500",
  },
  {
    action: "Recolección Reciclables",
    points: 50,
    // clock
    icon:
      "M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4.75a.75.75 0 00-1.5 0v4H7a.75.75 0 000 1.5h3.75a.75.75 0 00.75-.75V6.75z",
    bgColor: "bg-blue-500",
  },
  {
    action: "Recolección Peligrosos",
    points: 100,
    // exclamation-circle
    icon:
      "M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-10.5a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0V7.5zM10 15.75a1 1 0 100-2 1 1 0 000 2z",
    bgColor: "bg-red-500",
  },
  {
    action: "Referir Amigos",
    points: 200,
    // star (seguro y vistoso)
    icon:
      "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
    bgColor: "bg-purple-500",
  },
];


  constructor(
    private authService: AuthService,
    private descuentosService: DescuentosService,
    private canjesService: CanjesService,
  ) {}

  ngOnInit() { this.loadData(); }
  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadData() {
    this.loading = true;
    this.error = null;

    // 👇 usa currentUser$ SIEMPRE y devuelve of([]) cuando no haya usuario
    combineLatest([
      this.authService.currentUser$,
      this.authService.currentUser$.pipe(
        switchMap(user => user ? this.descuentosService.getDescuentosDisponibles(user.id) : of([]))
      ),
      this.authService.currentUser$.pipe(
        switchMap(user => user ? this.canjesService.getHistorialCanjes(user.id) : of([]))
      ),
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ([user, descuentosDto, canjesDto]: any) => {
        this.currentUser = user;

        // Mapeo DTO -> interfaz local Descuento
        this.descuentos = (descuentosDto || []).map((d: any) => ({
          id: d.id,
          nombre: d.nombre,
          descripcion: d.descripcion,
          puntosRequeridos: d.puntosRequeridos ?? d.puntosNecesarios ?? 0,
          categoria: d.categoria ?? (d.esPorcentaje ? "descuentos" : "productos"),
          activo: d.activo ?? true,
          stock: d.stock ?? 1,
          porcentajeDescuento: d.esPorcentaje ? d.valorDescuento : undefined,
          fechaVencimiento: d.fechaVencimiento ?? d.fechaFin ?? new Date().toISOString(),
        }));

        // Mapeo DTO -> interfaz local Canje
        this.canjesRecientes = (canjesDto || [])
          .slice(0, 3)
          .map((c: any) => ({
            id: c.id,
            descuentoNombre: c.descuentoNombre ?? c.descuento?.nombre ?? "Descuento",
            puntosUtilizados: c.puntosUtilizados ?? c.puntos ?? 0,
            fechaCanje: c.fechaCanje ?? new Date().toISOString(),
            codigoCanje: c.codigoCanje,
            utilizado: c.utilizado ?? false,
          }));

        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error("Error cargando datos:", error);
        this.error = "Error al cargar las recompensas. Intenta nuevamente.";
        this.loading = false;
      },
    });
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.applyFilter();
  }

  private applyFilter() {
    this.filteredDescuentos =
      this.selectedCategory === "all"
        ? this.descuentos
        : this.descuentos.filter((d) => d.categoria.toLowerCase() === this.selectedCategory);
  }

  async redeemReward(descuento: Descuento) {
    if (!this.currentUser || descuento.puntosRequeridos > this.currentUser.puntos || descuento.stock === 0) return;

    const confirmed = confirm(`¿Confirmas el canje de "${descuento.nombre}" por ${descuento.puntosRequeridos} puntos?`);
    if (!confirmed) return;

    try {
      this.loading = true;
      const canje = await firstValueFrom(
        this.canjesService.realizarCanje({ descuentoId: descuento.id })
      );

      if (canje) {
        this.currentUser.puntos -= descuento.puntosRequeridos;
        descuento.stock = Math.max(0, (descuento.stock ?? 1) - 1);

        this.canjesRecientes.unshift({
          id: canje.id,
          descuentoNombre: descuento.nombre,
          puntosUtilizados: descuento.puntosRequeridos,
          fechaCanje: new Date().toISOString(),
          codigoCanje: canje.codigoCanje,
          utilizado: false,
        });

        if (this.canjesRecientes.length > 3) this.canjesRecientes.pop();

        alert(`¡Canje exitoso! Tu código de canje es: ${canje.codigoCanje}.`);
      }
    } catch (error) {
      console.error("Error realizando canje:", error);
      alert("Error al realizar el canje. Intenta nuevamente.");
    } finally {
      this.loading = false;
    }
  }

  // 👇 añade este método que usa la plantilla
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  getCategoryColor(categoria: string): string {
    const colors: Record<string, string> = {
      productos: "bg-green-100 text-green-800",
      descuentos: "bg-blue-100 text-blue-800",
      experiencias: "bg-purple-100 text-purple-800",
      donaciones: "bg-yellow-100 text-yellow-800",
    };
    return colors[(categoria || "").toLowerCase()] || "bg-gray-100 text-gray-800";
  }

  trackByDescuento = (_: number, d: Descuento) => d.id;
  trackByCategory = (_: number, c: { id: string }) => c.id;
  trackByCanje = (_: number, c: Canje) => c.id;
}
