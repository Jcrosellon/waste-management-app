import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent {
  scheduleForm: FormGroup;
  isSubmitting = false;
  minDate: string;

  wasteTypes = [
    {
      id: 'plastico',
      name: 'Plástico',
      description: 'Botellas, envases y bolsas',
      points: 20,
      pointsColor: 'text-green-600',
      image: 'assets/rewards/plastico.png'
    },
    {
      id: 'vidrio',
      name: 'Vidrio',
      description: 'Botellas y frascos',
      points: 15,
      pointsColor: 'text-blue-600',
      image: 'assets/rewards/vidrio.png'
    },
    {
      id: 'papel',
      name: 'Papel y Cartón',
      description: 'Periódicos, cajas, revistas',
      points: 10,
      pointsColor: 'text-yellow-600',
      image: 'assets/rewards/papel.png'
    },
    {
      id: 'organico',
      name: 'Orgánico',
      description: 'Restos de comida, cáscaras',
      points: 25,
      pointsColor: 'text-brown-600',
      image: 'assets/rewards/organico.png'
    }
  ];



  timeSlots = [
    { value: 'morning', label: '8:00 AM - 12:00 PM' },
    { value: 'afternoon', label: '1:00 PM - 5:00 PM' },
    { value: 'evening', label: '6:00 PM - 8:00 PM' }
  ];

  upcomingCollections = [
    {
      type: 'Reciclables',
      date: '15 Dic',
      time: '9:00 AM',
      status: 'Confirmada',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      type: 'Orgánicos',
      date: '18 Dic',
      time: '2:00 PM',
      status: 'Pendiente',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.scheduleForm = this.fb.group({
      wasteType: ['', Validators.required],
      estimatedWeight: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      preferredDate: ['', Validators.required],
      preferredTime: ['', Validators.required],
      address: ['', Validators.required],
      specialInstructions: [''],
      notifyBeforeCollection: [true],
      recurringCollection: [false],
      ecoFriendlyPackaging: [false]
    });

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  selectWasteType(typeId: string) {
    this.scheduleForm.patchValue({ wasteType: typeId });
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      this.isSubmitting = true;

      // Simular programación
      setTimeout(() => {
        this.isSubmitting = false;
        alert('¡Recolección programada exitosamente! Te enviaremos una confirmación por email.');
        this.scheduleForm.reset();
      }, 2000);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.scheduleForm.controls).forEach(key => {
        this.scheduleForm.get(key)?.markAsTouched();
      });
    }
  }
}
