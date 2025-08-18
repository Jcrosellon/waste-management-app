// src/app/pages/login/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./reset-password.component.css'],
  template: `
  <div class="min-h-screen flex items-center justify-center bg-emerald-50/40 p-6">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">

        <!-- Header EcoWaste (igual al forgot) -->
        <div class="bg-emerald-600 px-6 py-4 flex items-center gap-3">
          <div class="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center text-xl text-white">♻️</div>
          <div class="font-semibold text-lg tracking-wide text-black">EcoWaste</div>
        </div>

        <div class="p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Restablecer contraseña</h1>
          <p class="text-sm text-gray-500 mb-6">Crea una nueva contraseña segura para tu cuenta.</p>

          <!-- Éxito (mismo diseño que forgot) -->
          <ng-container *ngIf="message; else formTpl">
            <div class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 flex gap-3 mb-1" aria-live="polite">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.004 7.004a1 1 0 01-1.414 0L3.293 8.714a1 1 0 011.414-1.414l3.004 3.004 6.297-6.297a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <div class="space-y-2">
                <p class="font-medium">{{ message }}</p>
                <a routerLink="/login"
                   class="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors reset-submit-btn">
                  Ir a iniciar sesión
                </a>
              </div>
            </div>
          </ng-container>

          <!-- Formulario -->
          <ng-template #formTpl>
            <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="off" novalidate>
              <!-- Trampas anti-autofill -->
              <input type="text" name="ecowaste-username" autocomplete="username" class="hidden" tabindex="-1" aria-hidden="true">
              <input type="password" name="ecowaste-dummy" autocomplete="new-password" class="hidden" tabindex="-1" aria-hidden="true">

              <label class="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
              <input
                type="password"
                formControlName="password"
                name="new-password"
                autocomplete="new-password"
                autocapitalize="off" autocorrect="off" spellcheck="false"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />

              <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
              <input
                type="password"
                formControlName="confirm"
                name="confirm-password"
                autocomplete="new-password"
                autocapitalize="off" autocorrect="off" spellcheck="false"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />

              <div class="text-red-600 text-sm mb-4" *ngIf="passMismatch">Las contraseñas no coinciden</div>

              <!-- Botón verde idéntico al forgot -->
              <button
                type="submit"
                class="reset-submit-btn w-full py-3 px-4 rounded-lg font-medium
                       focus:outline-none focus:ring-2 focus:ring-eco-green-500 focus:ring-offset-2
                       transition-colors"
                [disabled]="form.invalid || passMismatch || loading">
                {{ loading ? 'Guardando...' : 'Guardar nueva contraseña' }}
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
export class ResetPasswordComponent implements OnInit {
  token = '';
  form!: FormGroup;
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
        this.message = '¡Contraseña actualizada correctamente!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => {
        this.loading = false;
        this.error = (typeof e?.error === 'string') ? e.error : 'No se pudo actualizar la contraseña.';
      }
    });
  }
}
