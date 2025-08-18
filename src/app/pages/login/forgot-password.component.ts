import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./forgot-password.component.css'],  // 👈 NUEVO
  template: `
  <div class="min-h-screen flex items-center justify-center bg-emerald-50/40 p-6">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">

<!-- Header EcoWaste -->
<div class="bg-emerald-600 px-6 py-4 flex items-center gap-3">
  <div class="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center text-xl text-white">♻️</div>
  <div class="font-semibold text-lg tracking-wide text-black">EcoWaste</div>
</div>


        <div class="p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Recuperar contraseña</h1>
          <p class="text-sm text-gray-500 mb-6">Te enviaremos un enlace para restablecer tu contraseña.</p>

          <!-- Éxito -->
          <ng-container *ngIf="message; else formTpl">
            <div class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 flex gap-3 mb-1" aria-live="polite">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.004 7.004a1 1 0 01-1.414 0L3.293 8.714a1 1 0 011.414-1.414l3.004 3.004 6.297-6.297a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <div class="space-y-2">
                <p class="font-medium">{{ message }}</p>
                <p class="text-sm text-emerald-900/80">Si no lo ves, revisa tu carpeta de spam o promociones.</p>
                <a routerLink="/login"
                   class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
                  Volver a iniciar sesión
                </a>
              </div>
            </div>
          </ng-container>

          <!-- Form -->
          <ng-template #formTpl>
            <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="off" novalidate>
              <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <input
                type="email"
                formControlName="email"
                autocomplete="email"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="tu@email.com">
              <div class="text-red-600 text-sm mb-3" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
                Ingresa un email válido
              </div>
       <button
    type="submit"
    class="forgot-submit-btn w-full py-3 px-4 rounded-lg font-medium
           focus:outline-none focus:ring-2 focus:ring-eco-green-500 focus:ring-offset-2
           transition-colors"
    [disabled]="form.invalid || loading">
    {{ loading ? 'Enviando...' : 'Enviar instrucciones' }}
  </button>
              <div *ngIf="error" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm" aria-live="assertive">
                {{ error }}
              </div>
            </form>
          </ng-template>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  loading = false;
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.message = ''; this.error = '';
    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Si el email existe, te enviamos un enlace para restablecer tu contraseña.';
      },
      error: (e) => {
        this.loading = false;
        this.error = (typeof e?.error === 'string') ? e.error : 'No se pudo procesar la solicitud.';
      }
    });
  }
}
