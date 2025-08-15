import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // 👈 agrega RouterModule
  template: `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="bg-white w-full max-w-md p-6 rounded-lg shadow">
      <h1 class="text-xl font-bold mb-4">Restablecer contraseña</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="mb-4">
          <label class="block text-sm mb-2">Nueva contraseña</label>
          <input type="password" formControlName="password" class="w-full border rounded px-3 py-2">
        </div>
        <div class="mb-6">
          <label class="block text-sm mb-2">Confirmar contraseña</label>
          <input type="password" formControlName="confirm" class="w-full border rounded px-3 py-2">
          <div class="text-red-600 text-sm" *ngIf="passMismatch">Las contraseñas no coinciden</div>
        </div>

        <button class="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
                [disabled]="form.invalid || passMismatch || loading">
          {{ loading ? 'Guardando...' : 'Guardar nueva contraseña' }}
        </button>

        <div *ngIf="message" class="mt-3 text-sm text-green-700 bg-green-50 p-2 rounded">{{ message }}</div>
        <div *ngIf="error" class="mt-3 text-sm text-red-700 bg-red-50 p-2 rounded">{{ error }}</div>
      </form>
    </div>
  </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  token = '';              // 👈 no uses route aquí arriba
  form!: FormGroup;        // 👈 inicializa en constructor
  loading = false;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm:  ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // 👇 ahora sí, route ya está inyectado
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  get passMismatch() {
    const { password, confirm } = this.form.value;
    return !!password && !!confirm && password !== confirm;
  }

  submit() {
    if (this.form.invalid || this.passMismatch) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.message = ''; this.error = '';
    this.auth.resetPassword(this.token, this.form.value.password!).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Tu contraseña se actualizó correctamente. Redirigiendo al login…';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => {
        this.loading = false;
        this.error = (typeof e?.error === 'string') ? e.error : 'No se pudo actualizar la contraseña.';
      }
    });
  }
}
