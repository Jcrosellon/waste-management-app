import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./login.component.css'],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-green-50 to-eco-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 animate-fade-in">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-eco-green-600 rounded-full flex items-center justify-center shadow">
            <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿No tienes cuenta?
            <a routerLink="/register" class="font-medium text-eco-green-700 hover:text-eco-green-600">
              Regístrate aquí
            </a>
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8 animate-slide-up">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green-500 focus:border-transparent"
                  [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  placeholder="tu@email.com"
                  autocomplete="email"
                >
                <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                     class="text-red-500 text-sm mt-1">
                  <span *ngIf="loginForm.get('email')?.errors?.['required']">El email es requerido</span>
                  <span *ngIf="loginForm.get('email')?.errors?.['email']">Ingresa un email válido</span>
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>

                <!-- Respeta tu CSS: .password-wrapper / .toggle / .password-input -->
                <div class="password-wrapper">
                  <input
                    id="password"
                    [type]="showPassword ? 'text' : 'password'"
                    formControlName="password"
                    class="password-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green-500 focus:border-transparent"
                    [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    placeholder="••••••••"
                    autocomplete="current-password"
                  />

                  <button
                    type="button"
                    class="toggle"
                    (click)="togglePasswordVisibility($event)"
                    [attr.aria-label]="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                    <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 5 12 5c4.64 0 8.577 2.51 9.964 6.683.07.21.07.429 0 .639C20.577 16.49 16.64 19 12 19c-4.64 0-8.577-2.51-9.964-6.678z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M3 3l18 18M10.58 10.58A3 3 0 0013.42 13.42M9.88 9.88L7.05 7.05M6.26 6.26C4.34 7.58 2.88 9.38 2.04 11.68a1 1 0 000 .64C3.42 16.49 7.36 19 12 19c1.49 0 2.91-.26 4.2-.74M20.94 13.73c.43-.56.8-1.18 1.06-1.82a1 1 0 000-.64C20.58 7.51 16.64 5 12 5c-.9 0-1.78.09-2.62.26"/>
                    </svg>
                  </button>
                </div>

                <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                     class="text-red-500 text-sm mt-1">
                  La contraseña es requerida
                </div>
              </div>

              <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
<button
  type="submit"
  [disabled]="loginForm.invalid || isLoading"
  class="login-submit-btn w-full py-3 px-4 rounded-lg font-medium
         focus:outline-none focus:ring-2 focus:ring-eco-green-500 focus:ring-offset-2
         transition-colors border-0 shadow-md">
  <span *ngIf="!isLoading">Iniciar Sesión</span>
  <span *ngIf="isLoading" class="flex items-center justify-center">
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Iniciando sesión...
  </span>
</button>



              <p class="text-center text-sm text-gray-600">
                ¿Olvidaste tu contraseña?
                <a routerLink="/forgot-password" class="font-medium text-eco-green-700 hover:text-eco-green-600">
                  Recuperar contraseña
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => { this.isLoading = false; this.router.navigate([this.returnUrl || '/dashboard']); },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = (typeof error?.error === 'string') ? error.error : (error?.error?.message || 'Error de conexión. Intenta nuevamente.');
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach(c => c.markAsTouched());
    }
  }

  togglePasswordVisibility(e: MouseEvent) {
    e.preventDefault();
    this.showPassword = !this.showPassword;
  }
}
