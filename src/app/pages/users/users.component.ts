import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms"
import { UsuarioService, UsuarioFilters } from "../../services/usuario.service"
import { AuthService } from "../../services/auth.service"
import { UsuarioProfile } from "../../models/usuario.model"

@Component({
    selector: "app-users",
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
    usuarios: UsuarioProfile[] = []
    filteredUsuarios: UsuarioProfile[] = []
    loading = false
    error = ""

    // Filtros
    searchForm: FormGroup
    roles = ["Usuario", "Recolector", "Administrador"]

    // Paginación
    currentPage = 1
    pageSize = 10
    totalPages = 1
    totalCount = 0

    // Modal de edición
    showEditModal = false
    editingUser: UsuarioProfile | null = null
    editForm: FormGroup

    constructor(
        private usuarioService: UsuarioService,
        private authService: AuthService,
        private fb: FormBuilder,
    ) {
        this.searchForm = this.fb.group({
            nombre: [""],
            email: [""],
            rol: [""],
        })

        this.editForm = this.fb.group({
            nombre: [""],
            email: [""],
            telefono: [""],
            direccion: [""],
            rol: ["Usuario"],
            activo: [true],
        })
    }

    ngOnInit() {
        this.loadUsuarios()
    }

   loadUsuarios() {
  this.loading = true;
  this.error = "";

  const filters: UsuarioFilters = {
    ...this.searchForm.value,
    pageNumber: this.currentPage,
    pageSize: this.pageSize,
  };

  Object.keys(filters).forEach((key) => {
    if (!filters[key as keyof UsuarioFilters]) {
      delete filters[key as keyof UsuarioFilters];
    }
  });

  this.usuarioService.getUsuarios(filters).subscribe({
    next: (response) => {
      // 🔽 Normalización de la fecha antes de asignar a this.usuarios
      this.usuarios = (response?.data?.items ?? []).map((u: any) => {
        const raw =
          u.fechaRegistro ??
          u.createdAt ??
          u.fecha_registro ??
          u.registeredAt ??
          u.registrationDate ??
          null;

        return {
          ...u,
          // Soporta ISO string, timestamp (ms o s), y strings dd/MM/yyyy
          fechaRegistro: this.normalizeDate(raw),
        };
      });

      this.filteredUsuarios = this.usuarios;
      this.totalCount = response?.data?.totalCount ?? this.usuarios.length;
      this.totalPages = response?.data?.totalPages ?? 1;
      this.loading = false;
    },
    error: (error) => {
      this.error = "Error al cargar usuarios";
      this.loading = false;
      console.error("Error:", error);
    },
  });
}

/** Util para convertir distintos formatos a Date o null */
private normalizeDate(raw: any): Date | null {
  if (!raw && raw !== 0) return null;

  // Si ya es Date
  if (raw instanceof Date && !isNaN(raw.valueOf())) return raw;

  // Número: timestamp (milisegundos o segundos)
  if (typeof raw === "number") {
    // Heurística: si es muy chico, asume segundos
    const ms = raw < 10_000_000_000 ? raw * 1000 : raw;
    const d = new Date(ms);
    return isNaN(d.valueOf()) ? null : d;
  }

  // String ISO-8601 o similar -> Date lo parsea bien
  if (typeof raw === "string") {
    // Caso típico no-ISO "dd/MM/yyyy"
    const ddMmYyyy = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/;
    const m = raw.match(ddMmYyyy);
    if (m) {
      const [, dd, mm, yyyy, hh = "00", mi = "00", ss = "00"] = m;
      const d = new Date(
        Number(yyyy),
        Number(mm) - 1,
        Number(dd),
        Number(hh),
        Number(mi),
        Number(ss),
      );
      return isNaN(d.valueOf()) ? null : d;
    }

    // Intento general (ISO, "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-dd HH:mm:ss", etc.)
    const guess = new Date(raw.replace(" ", "T"));
    return isNaN(guess.valueOf()) ? null : guess;
  }

  return null;
}


    onSearch() {
        this.currentPage = 1
        this.loadUsuarios()
    }

    onPageChange(page: number) {
        this.currentPage = page
        this.loadUsuarios()
    }

    editUser(user: UsuarioProfile) {
        this.editingUser = user
        this.editForm.patchValue({
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono || "",
            direccion: user.direccion || "",
            rol: user.rol,
            activo: user.activo,
        })
        this.showEditModal = true
    }

    saveUser() {
        if (this.editForm.invalid || !this.editingUser) return

        const updateData = this.editForm.value

        this.usuarioService.updateUsuario(this.editingUser.id, updateData).subscribe({
            next: () => {
                this.showEditModal = false
                this.editingUser = null
                this.loadUsuarios()
            },
            error: (error) => {
                this.error = "Error al actualizar usuario"
                console.error("Error:", error)
            },
        })
    }

    deactivateUser(user: UsuarioProfile) {
        if (confirm(`¿Estás seguro de desactivar al usuario ${user.nombre}?`)) {
            this.usuarioService.deleteUsuario(user.id).subscribe({
                next: () => {
                    this.loadUsuarios()
                },
                error: (error) => {
                    this.error = "Error al desactivar usuario"
                    console.error("Error:", error)
                },
            })
        }
    }

    closeModal() {
        this.showEditModal = false
        this.editingUser = null
        this.editForm.reset()
    }

    getRoleBadgeClass(rol: string): string {
        switch (rol) {
            case "Administrador":
                return "badge-admin"
            case "Recolector":
                return "badge-recolector"
            default:
                return "badge-usuario"
        }
    }

    getStatusBadgeClass(activo: boolean): string {
        return activo ? "badge-active" : "badge-inactive"
    }

    approveUser(user: UsuarioProfile) {
        this.usuarioService.approveUsuario(user.id).subscribe({
            next: () => this.loadUsuarios(),
            error: (e) => { this.error = "No se pudo aprobar al usuario"; console.error(e); }
        });
    }

    rejectUser(user: UsuarioProfile) {
        this.usuarioService.rejectUsuario(user.id).subscribe({
            next: () => this.loadUsuarios(),
            error: (e) => { this.error = "No se pudo rechazar al usuario"; console.error(e); }
        });
    }

}
