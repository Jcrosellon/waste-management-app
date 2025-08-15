import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TiposResiduoService, TipoResiduo } from "../../services/tipo-residuo.service";
import { RecoleccionesService, RecoleccionUI, ProgramarRecoleccionRequest } from "../../services/recoleccion.service";
import { AuthService } from "../../services/auth.service";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-schedule",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./schedule.component.html",
})
export class ScheduleComponent implements OnInit {
  scheduleForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  minDate: string;
  error: string | null = null;
  successMessage: string | null = null;

  wasteTypes: TipoResiduo[] = [];
  upcomingCollections: RecoleccionUI[] = [];

  timeSlots = [
    { value: "morning", label: "8:00 AM - 12:00 PM" },
    { value: "afternoon", label: "1:00 PM - 5:00 PM" },
    { value: "evening", label: "6:00 PM - 8:00 PM" },
  ];

  constructor(
    private fb: FormBuilder,
    private tipoResiduoService: TiposResiduoService,
    private recoleccionService: RecoleccionesService,
    private authService: AuthService,
  ) {
    this.scheduleForm = this.fb.group({
      wasteType: ["", Validators.required],            // <- id del tipo
      estimatedWeight: ["", [Validators.required, Validators.min(1), Validators.max(100)]],
      preferredDate: ["", Validators.required],
      preferredTime: ["", Validators.required],
      address: ["", Validators.required],
      specialInstructions: [""],
      notifyBeforeCollection: [true],
      recurringCollection: [false],
      ecoFriendlyPackaging: [false],
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split("T")[0];
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.error = null;

    // TIPOS
    this.tipoResiduoService
      .getTiposResiduo()
      .pipe(
        catchError((error) => {
          console.error("Error loading waste types:", error);
          this.error = "Error al cargar tipos de residuo";
          return of([]);
        }),
      )
      .subscribe((tipos) => {
        // OJO: la API no trae 'activo', así que no filtres por ello
        this.wasteTypes = tipos; // <- sin filtro
      });

    // HISTORIAL
    this.recoleccionService
      .getHistorialRecolecciones()
      .pipe(
        catchError((error) => {
          console.error("Error loading collections:", error);
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((recolecciones) => {
        const now = new Date();
        this.upcomingCollections = recolecciones
          .filter((r) => new Date(r.fechaSolicitud) > now)
          .slice(0, 5);
      });
  }

  onSubmit() {
    // para depurar:
    console.log("[Schedule] submit valid?", this.scheduleForm.valid, this.scheduleForm.value);

    if (this.scheduleForm.valid) {
      this.isSubmitting = true;
      this.error = null;
      this.successMessage = null;

      const v = this.scheduleForm.value;

      // Combinar fecha + franja horaria (opcional: pon una hora representativa)
      const date = new Date(v.preferredDate);
      if (v.preferredTime === "morning") date.setHours(9, 0, 0, 0);
      if (v.preferredTime === "afternoon") date.setHours(14, 0, 0, 0);
      if (v.preferredTime === "evening") date.setHours(19, 0, 0, 0);

      const req: ProgramarRecoleccionRequest = {
        tipoResiduoId: Number.parseInt(v.wasteType, 10),
        pesoEstimado: Number.parseFloat(v.estimatedWeight),
        fechaSolicitud: date.toISOString(),
        subtipo: undefined,
        observaciones:
          `Horario preferido: ${this.getTimeSlotLabel(v.preferredTime)}. ` +
          `Dirección: ${v.address}. ${v.specialInstructions || ""}`,
      };

      console.log("[Schedule] request:", req);

      this.recoleccionService
        .programarRecoleccion(req)
        .pipe(
          catchError((error) => {
            console.error("Error scheduling collection:", error);
            this.error = error?.error?.message || "Error al programar la recolección. Por favor intenta nuevamente.";
            return of(null);
          }),
          finalize(() => {
            this.isSubmitting = false;
          }),
        )
        .subscribe((resp) => {
          console.log("[Schedule] response:", resp);
          if (resp) {
            this.successMessage = "¡Recolección programada exitosamente! Te enviaremos una confirmación por email.";
            this.scheduleForm.reset();
            this.loadData();
          }
        });
    } else {
      Object.keys(this.scheduleForm.controls).forEach((k) => this.scheduleForm.get(k)?.markAsTouched());
    }
  }

  private getTimeSlotLabel(value: string): string {
    const slot = this.timeSlots.find((s) => s.value === value);
    return slot ? slot.label : value;
  }

  getPointsColor(tipo: TipoResiduo): string {
    const colors: { [key: string]: string } = {
      Orgánico: "text-green-600",
      "Inorgánico Reciclable": "text-blue-600",
      Peligroso: "text-red-600",
    };
    return colors[tipo.nombre] || "text-gray-600";
  }

  getStatusColor(estado: string): string {
    const colors: { [key: string]: string } = {
      Programada: "bg-blue-100 text-blue-800",
      Confirmada: "bg-green-100 text-green-800",
      "En Proceso": "bg-yellow-100 text-yellow-800",
      Completada: "bg-green-100 text-green-800",
      Cancelada: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  }

  getTipoResiduoNombre(tipoId: number): string {
    const tipo = this.wasteTypes.find((t) => t.id === tipoId);
    return tipo ? tipo.nombre : "Desconocido";
  }
}
