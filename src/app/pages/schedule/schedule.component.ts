import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { TiposResiduoService, TipoResiduo } from "../../services/tipo-residuo.service"
import { RecoleccionesService, Recoleccion } from "../../services/recoleccion.service"
import { AuthService } from "../../services/auth.service"
import { catchError, finalize } from "rxjs/operators"
import { of } from "rxjs"

@Component({
  selector: "app-schedule",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./schedule.component.html",
})
export class ScheduleComponent implements OnInit {
  scheduleForm: FormGroup
  isSubmitting = false
  isLoading = true
  minDate: string
  error: string | null = null
  successMessage: string | null = null

  wasteTypes: TipoResiduo[] = []
  upcomingCollections: Recoleccion[] = []

  timeSlots = [
    { value: "morning", label: "8:00 AM - 12:00 PM" },
    { value: "afternoon", label: "1:00 PM - 5:00 PM" },
    { value: "evening", label: "6:00 PM - 8:00 PM" },
  ]

  constructor(
    private fb: FormBuilder,
    private tiposResiduoService: TiposResiduoService,
    private recoleccionesService: RecoleccionesService,
    private authService: AuthService,
  ) {
    this.scheduleForm = this.fb.group({
      wasteType: ["", Validators.required],
      estimatedWeight: ["", [Validators.required, Validators.min(1), Validators.max(100)]],
      preferredDate: ["", Validators.required],
      preferredTime: ["", Validators.required],
      address: ["", Validators.required],
      specialInstructions: [""],
      notifyBeforeCollection: [true],
      recurringCollection: [false],
      ecoFriendlyPackaging: [false],
    })

    // Set minimum date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    this.minDate = tomorrow.toISOString().split("T")[0]
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.isLoading = true
    this.error = null

    // Cargar tipos de residuo
    this.tiposResiduoService
      .getTiposResiduo()
      .pipe(
        catchError((error) => {
          console.error("Error loading waste types:", error)
          this.error = "Error al cargar tipos de residuo"
          return of([])
        }),
      )
      .subscribe((tipos) => {
        this.wasteTypes = tipos.filter((t) => t.activo)
      })

    // Cargar historial de recolecciones
    this.recoleccionesService
      .getHistorialRecolecciones()
      .pipe(
        catchError((error) => {
          console.error("Error loading collections:", error)
          return of([])
        }),
        finalize(() => {
          this.isLoading = false
        }),
      )
      .subscribe((recolecciones) => {
        // Filtrar solo las próximas recolecciones
        const now = new Date()
        this.upcomingCollections = recolecciones.filter((r) => new Date(r.fechaSolicitud) > now).slice(0, 5) // Mostrar solo las próximas 5
      })


  }

  getTipoResiduoNombre(id: number | undefined): string {
    if (!id) return 'Recolección';
    const t = this.wasteTypes.find(x => x.id === id);
    return t?.nombre ?? `Tipo #${id}`;
  }


  selectWasteType(typeId: number) {
    this.scheduleForm.patchValue({ wasteType: typeId })
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      this.isSubmitting = true
      this.error = null
      this.successMessage = null

      const formValue = this.scheduleForm.value

      const request = {
        tipoResiduoId: Number.parseInt(formValue.wasteType),
        pesoEstimado: Number.parseFloat(formValue.estimatedWeight),
        fechaSolicitud: new Date(formValue.preferredDate).toISOString(),
        observaciones: `Horario preferido: ${this.getTimeSlotLabel(formValue.preferredTime)}. Dirección: ${formValue.address}. ${formValue.specialInstructions || ""}`,
      }

      this.recoleccionesService
        .programarRecoleccion(request)
        .pipe(
          catchError((error) => {
            console.error("Error scheduling collection:", error)
            this.error = "Error al programar la recolección. Por favor intenta nuevamente."
            return of(null)
          }),
          finalize(() => {
            this.isSubmitting = false
          }),
        )
        .subscribe((response) => {
          if (response) {
            this.successMessage = "¡Recolección programada exitosamente! Te enviaremos una confirmación por email."
            this.scheduleForm.reset()
            this.loadData() // Recargar datos para mostrar la nueva recolección
          }
        })
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.scheduleForm.controls).forEach((key) => {
        this.scheduleForm.get(key)?.markAsTouched()
      })
    }
  }

  private getTimeSlotLabel(value: string): string {
    const slot = this.timeSlots.find((s) => s.value === value)
    return slot ? slot.label : value
  }

  getPointsColor(tipo: TipoResiduo): string {
    const colors: { [key: string]: string } = {
      Orgánico: "text-green-600",
      Inorgánico: "text-blue-600",
      Peligroso: "text-red-600",
      Papel: "text-yellow-600",
      Plástico: "text-purple-600",
      Vidrio: "text-cyan-600",
    }
    return colors[tipo.nombre] || "text-gray-600"
  }

  getStatusColor(estado: string): string {
    const colors: { [key: string]: string } = {
      Programada: "bg-blue-100 text-blue-800",
      Confirmada: "bg-green-100 text-green-800",
      "En Proceso": "bg-yellow-100 text-yellow-800",
      Completada: "bg-green-100 text-green-800",
      Cancelada: "bg-red-100 text-red-800",
    }
    return colors[estado] || "bg-gray-100 text-gray-800"
  }
}
