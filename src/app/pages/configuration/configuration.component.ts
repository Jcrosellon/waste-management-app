import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import {
  ConfiguracionService,
  ConfiguracionZona,
  ReglaValidacion,
  Localidad,
  TipoResiduo,
} from "../../services/configuracion.service"
import { AuthService } from "../../services/auth.service"
import { Observable, forkJoin, map } from "rxjs"

@Component({
  selector: "app-configuration",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.css"],
})
export class ConfigurationComponent implements OnInit {
  activeTab: "zonas" | "reglas" = "zonas"
  loading = false
  error: string | null = null

  // Data
  configuracionesZona: ConfiguracionZona[] = []
  reglasValidacion: ReglaValidacion[] = []
  localidades: Localidad[] = []
  tiposResiduo: TipoResiduo[] = []

  // Forms
  zonaForm: FormGroup
  reglaForm: FormGroup
  showZonaForm = false
  showReglaForm = false
  editingRegla: ReglaValidacion | null = null

  // Role check
  isAdmin$: Observable<boolean>

  constructor(
    private configuracionService: ConfiguracionService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.isAdmin$ = this.authService.currentUser$.pipe(map((user) => user?.rol === "Administrador"))

    this.zonaForm = this.fb.group({
      localidadId: [null, Validators.required],
      tipoResiduoId: [null, Validators.required],
      frecuenciaDias: [7, [Validators.required, Validators.min(1)]],
      pesoMinimoKg: [0, [Validators.required, Validators.min(0)]],
      pesoMaximoKg: [100, [Validators.required, Validators.min(1)]],
      horaInicio: ["06:00", Validators.required],
      horaFin: ["18:00", Validators.required],
      requiereValidacionFoto: [false],
      activa: [true],
    });

    this.reglaForm = this.fb.group({
      tipoResiduoId: [null, Validators.required],
      localidadId: [null],
      descripcion: ["", Validators.required],
      activa: [true],
    });

  }

  ngOnInit(): void {
    this.loadData()
  }

loadData(): void {
  this.loading = true;
  this.error = null;

  forkJoin({
    zonas: this.configuracionService.getConfiguracionesZona(),
    reglas: this.configuracionService.getReglasValidacion(),
    localidades: this.configuracionService.getLocalidades(),
    tipos: this.configuracionService.getTiposResiduo(),
  }).subscribe({
    next: ({ zonas, reglas, localidades, tipos }) => {
      // Tus servicios YA normalizan Localidades/Tipos,
      // así que puedes asignar directo:
      this.configuracionesZona = zonas ?? [];
      this.reglasValidacion = reglas ?? [];
      this.localidades = localidades ?? [];
      this.tiposResiduo = tipos ?? [];

      this.loading = false;
    },
    error: (err) => {
      console.error("Error loading configuration:", err);
      this.error = "Error al cargar la configuración";
      this.loading = false;
    },
  });
}

  setActiveTab(tab: "zonas" | "reglas"): void {
    this.activeTab = tab
    this.showZonaForm = false
    this.showReglaForm = false
    this.editingRegla = null
  }

  // Zona Configuration Methods
  toggleZonaForm(): void {
    this.showZonaForm = !this.showZonaForm
    if (this.showZonaForm) {
      this.zonaForm.reset({
        frecuenciaDias: 7,
        pesoMinimoKg: 0,
        pesoMaximoKg: 100,
        horaInicio: "06:00",
        horaFin: "18:00",
        requiereValidacionFoto: false,
        activa: true,
      })
    }
  }

  onSubmitZona(): void {
    if (this.zonaForm.valid) {
      this.loading = true
      this.configuracionService.crearConfiguracionZona(this.zonaForm.value).subscribe({
        next: () => {
          this.loadData()
          this.showZonaForm = false
          this.zonaForm.reset()
        },
        error: (error) => {
          this.error = "Error al crear la configuración de zona"
          this.loading = false
          console.error("Error creating zone configuration:", error)
        },
      })
    }
  }

  // Regla Validation Methods
  toggleReglaForm(): void {
    this.showReglaForm = !this.showReglaForm
    this.editingRegla = null
    if (this.showReglaForm) {
      this.reglaForm.reset({
        activa: true,
      })
    }
  }

  editRegla(regla: ReglaValidacion): void {
    this.editingRegla = regla
    this.showReglaForm = true
    this.reglaForm.patchValue({
      tipoResiduoId: regla.tipoResiduoId,
      localidadId: regla.localidadId || "",
      descripcion: regla.descripcion,
      activa: regla.activa,
    })
  }

  onSubmitRegla(): void {
    if (this.reglaForm.valid) {
      this.loading = true

      const operation: Observable<any> = this.editingRegla
        ? this.configuracionService.actualizarReglaValidacion(this.editingRegla.id, this.reglaForm.value)
        : this.configuracionService.crearReglaValidacion(this.reglaForm.value)

      operation.subscribe({
        next: () => {
          this.loadData()
          this.showReglaForm = false
          this.editingRegla = null
          this.reglaForm.reset()
        },
        error: (error) => {
          this.error = this.editingRegla ? "Error al actualizar la regla" : "Error al crear la regla"
          this.loading = false
          console.error("Error with rule:", error)
        },
      })
    }
  }

  cancelReglaEdit(): void {
    this.showReglaForm = false
    this.editingRegla = null
    this.reglaForm.reset()
  }

  getLocalidadNombre(id: number): string {
    const localidad = this.localidades.find((l) => l.id === id)
    return localidad ? localidad.nombre : "N/A"
  }

  getTipoResiduoNombre(id: number): string {
    const tipo = this.tiposResiduo.find((t) => t.id === id)
    return tipo ? tipo.nombre : "N/A"
  }
}
