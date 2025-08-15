import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // 👈 agrega RouterModule
  template: `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="bg-white w-full max-w-md p-6 rounded-lg shadow">
      <h1 class="text-xl font-bold mb-4">Recuperar contraseña</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label class="block text-sm mb-2">Correo electrónico</label>
        <input type="email" formControlName="email" class="w-full border rounded px-3 py-2 mb-2" placeholder="tu@email.com">
        <div class="text-red-600 text-sm mb-2" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
          Ingresa un email válido
        </div>

        <button class="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
                [disabled]="form.invalid || loading">
          {{ loading ? 'Enviando...' : 'Enviar instrucciones' }}
        </button>

        <div *ngIf="message" class="mt-3 text-sm text-green-700 bg-green-50 p-2 rounded">{{ message }}</div>
        <div *ngIf="error" class="mt-3 text-sm text-red-700 bg-red-50 p-2 rounded">{{ error }}</div>

        <!-- Link de prueba para dev -->
        <div *ngIf="devToken" class="mt-3 text-xs text-gray-600">
          Link de prueba:
          <a [routerLink]="['/reset-password']" [queryParams]="{ token: devToken }" class="underline">
            /reset-password?token={{ devToken }}
          </a>
        </div>
      </form>
    </div>
  </div>
  `
})
export class ForgotPasswordComponent {
  form!: FormGroup;        // 👈 declara sin inicializar arriba
  loading = false;
  message = '';
  error = '';
  devToken = '';           // 👈 solo guardamos el token

  constructor(private fb: FormBuilder, private auth: AuthService) {
    // 👇 inicializa aquí (ya existe fb)
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.message = ''; this.error = '';
    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = 'Si el email existe, enviaremos un enlace para restablecer tu contraseña.';
        const url: string = res?.resetUrl || '';
        this.devToken = url.split('token=')[1] || '';  // 👈 extrae token para probar
      },
      error: (e) => {
        this.loading = false;
        this.error = (typeof e?.error === 'string') ? e.error : 'No se pudo procesar la solicitud.';
      }
    });
  }
}
