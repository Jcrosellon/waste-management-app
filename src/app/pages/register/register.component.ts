import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {
  type FormGroup,
  Validators,
  ReactiveFormsModule,
  type AbstractControl,
  type ValidationErrors,
} from "@angular/forms"
import { Router } from '@angular/router';
import { switchMap } from "rxjs/operators"
import { AuthService } from "../../services/auth.service"
import { FormBuilder } from '@angular/forms';

function matchPasswords(control: AbstractControl): ValidationErrors | null {
  const pass = control.get("password")?.value
  const confirm = control.get("confirmPassword")?.value
  return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null
}

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  registerForm: FormGroup
  isSubmitting = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        phone: [""],
        address: [""],
        city: [""],
        zipCode: [""],
        notifications: [true],
        newsletter: [false],
        terms: [false, Validators.requiredTrue],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        role: ["Usuario", Validators.required], // Cambiado de 'Recolector' a 'Usuario' por defecto
      },
      { validators: matchPasswords },
    )
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Object.values(this.registerForm.controls).forEach((c) => c.markAsTouched())
      return
    }

    this.isSubmitting = true
    this.errorMessage = ""

    const v = this.registerForm.value

    const registroPayload = {
      nombre: `${v.firstName} ${v.lastName}`.trim(),
      email: v.email,
      rol: v.role,
      password: v.password,
      // Campos opcionales que el backend puede recibir
      ...(v.phone && { telefono: v.phone }),
      ...(v.address && v.city && { direccion: `${v.address}, ${v.city}` }),
    }

    this.authService
      .register(registroPayload)
      .pipe(switchMap(() => this.authService.login({ email: v.email, password: v.password })))
      .subscribe({
        next: () => {
          this.isSubmitting = false
          this.router.navigate(["/dashboard"])
        },
        error: (error) => {
          this.isSubmitting = false
          this.errorMessage =
            typeof error?.error === "string"
              ? error.error
              : error?.error?.message || "No se pudo crear la cuenta. Intenta nuevamente."
        },
      })
  }
}
