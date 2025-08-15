import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { DescuentosService, Descuento, CrearDescuentoRequest } from "../../services/descuentos.service"
import { AuthService } from "../../services/auth.service"
import { Observable, map } from "rxjs"

@Component({
  selector: "app-discounts",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./discounts.component.html",
  styleUrls: ["./discounts.component.css"],
})
export class DiscountsComponent implements OnInit {
  descuentos: Descuento[] = []
  loading = false
  error: string | null = null
  showCreateForm = false
  editingDescuento: Descuento | null = null

  createForm: FormGroup
  isAdmin$: Observable<boolean>

  constructor(
    private descuentosService: DescuentosService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.isAdmin$ = this.authService.currentUser$.pipe(map((user) => user?.rol === "Administrador"))

    this.createForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(3)]],
      descripcion: ["", [Validators.required, Validators.minLength(10)]],
      puntosRequeridos: [0, [Validators.required, Validators.min(1)]],
      valorDescuento: [0, [Validators.required, Validators.min(0.01)]],
      esPorcentaje: [false],
      fechaInicio: ["", Validators.required],
      fechaFin: ["", Validators.required],
      cantidadDisponible: [-1, Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadDescuentos()
  }

  loadDescuentos(): void {
    this.loading = true
    this.error = null

    this.descuentosService.getDescuentos().subscribe({
      next: (descuentos) => {
        this.descuentos = descuentos
        this.loading = false
      },
      error: (error) => {
        this.error = "Error al cargar descuentos: " + (error.error?.message || error.message)
        this.loading = false
      },
    })
  }

  onCreateDescuento(): void {
    if (this.createForm.valid) {
      this.loading = true
      const descuentoData: CrearDescuentoRequest = this.createForm.value

      this.descuentosService.crearDescuento(descuentoData).subscribe({
        next: () => {
          this.loadDescuentos()
          this.showCreateForm = false
          this.createForm.reset()
          this.loading = false
        },
        error: (error) => {
          this.error = "Error al crear descuento: " + (error.error?.message || error.message)
          this.loading = false
        },
      })
    }
  }

  onEditDescuento(descuento: Descuento): void {
    this.editingDescuento = descuento
    this.createForm.patchValue({
      nombre: descuento.nombre,
      descripcion: descuento.descripcion,
      puntosRequeridos: descuento.puntosRequeridos,
      valorDescuento: descuento.valorDescuento,
      esPorcentaje: descuento.esPorcentaje,
      fechaInicio: descuento.fechaInicio.split("T")[0],
      fechaFin: descuento.fechaFin.split("T")[0],
      cantidadDisponible: descuento.cantidadDisponible,
    })
    this.showCreateForm = true
  }

  onUpdateDescuento(): void {
    if (this.createForm.valid && this.editingDescuento) {
      this.loading = true
      const descuentoData = this.createForm.value

      this.descuentosService.actualizarDescuento(this.editingDescuento.id, descuentoData).subscribe({
        next: () => {
          this.loadDescuentos()
          this.cancelEdit()
          this.loading = false
        },
        error: (error) => {
          this.error = "Error al actualizar descuento: " + (error.error?.message || error.message)
          this.loading = false
        },
      })
    }
  }

  onDeleteDescuento(id: number): void {
    if (confirm("¿Estás seguro de que quieres eliminar este descuento?")) {
      this.loading = true

      this.descuentosService.eliminarDescuento(id).subscribe({
        next: () => {
          this.loadDescuentos()
          this.loading = false
        },
        error: (error) => {
          this.error = "Error al eliminar descuento: " + (error.error?.message || error.message)
          this.loading = false
        },
      })
    }
  }

  cancelEdit(): void {
    this.editingDescuento = null
    this.showCreateForm = false
    this.createForm.reset()
  }

  formatDescuento(descuento: Descuento): string {
    return descuento.esPorcentaje
      ? `${descuento.valorDescuento}% de descuento`
      : `$${descuento.valorDescuento} de descuento`
  }

  getStatusClass(descuento: Descuento): string {
    if (!descuento.activo) return "status-inactive"
    if (!descuento.puedeCanjearse) return "status-unavailable"
    return "status-active"
  }

  getStatusText(descuento: Descuento): string {
    if (!descuento.activo) return "Inactivo"
    if (!descuento.puedeCanjearse) return "Agotado"
    return "Disponible"
  }
}
