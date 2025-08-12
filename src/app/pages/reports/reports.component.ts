import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p class="text-gray-600 mt-2">Consulta tu historial de recolecciones y progreso ambiental</p>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select formControlName="period" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último año</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Residuo</label>
              <select formControlName="wasteType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="">Todos los tipos</option>
                <option value="organic">Orgánicos</option>
                <option value="recyclable">Reciclables</option>
                <option value="hazardous">Peligrosos</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select formControlName="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="">Todos los estados</option>
                <option value="completed">Completadas</option>
                <option value="pending">Pendientes</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
            <div class="flex items-end">
              <button type="button" 
                      (click)="applyFilters()"
                      class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Aplicar Filtros
              </button>
            </div>
          </form>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div *ngFor="let stat of statistics" class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div [ngClass]="stat.bgColor" class="w-12 h-12 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path [attr.d]="stat.icon"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
                    <p class="text-sm text-gray-500">{{ stat.label }}</p>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="flex items-center text-sm">
                    <span [ngClass]="stat.changeColor" class="flex items-center">
                      <svg *ngIf="stat.change > 0" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <svg *ngIf="stat.change < 0" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      {{ Math.abs(stat.change) }}%
                    </span>
                    <span class="text-gray-500 ml-2">vs mes anterior</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Collections History -->
            <div class="bg-white rounded-lg shadow">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Historial de Recolecciones</h2>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let collection of collections">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ collection.date }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div [ngClass]="collection.typeColor" class="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path [attr.d]="collection.typeIcon"></path>
                            </svg>
                          </div>
                          <span class="text-sm font-medium text-gray-900">{{ collection.type }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ collection.weight }} kg</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          +{{ collection.points }} pts
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [ngClass]="collection.statusColor" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ collection.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Monthly Progress -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Progreso Mensual</h3>
              <div class="space-y-4">
                <div *ngFor="let progress of monthlyProgress">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">{{ progress.label }}</span>
                    <span class="text-sm text-gray-500">{{ progress.current }}/{{ progress.target }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div [ngClass]="progress.color" class="h-2 rounded-full transition-all duration-300" [style.width.%]="progress.percentage"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Environmental Impact -->
            <div class="bg-green-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-green-900 mb-4">Tu Impacto Ambiental</h3>
              <div class="space-y-4">
                <div *ngFor="let impact of environmentalImpact" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div [ngClass]="impact.bgColor" class="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path [attr.d]="impact.icon"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-green-900">{{ impact.label }}</p>
                      <p class="text-xs text-green-600">{{ impact.description }}</p>
                    </div>
                  </div>
                  <span class="text-lg font-bold text-green-900">{{ impact.value }}</span>
                </div>
              </div>
            </div>

            <!-- Achievements -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Logros Recientes</h3>
              <div class="space-y-3">
                <div *ngFor="let achievement of achievements" class="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ achievement.title }}</p>
                    <p class="text-xs text-gray-500">{{ achievement.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent {
  filterForm: FormGroup;
  Math = Math;

  statistics = [
    {
      label: 'Total Recolecciones',
      value: '24',
      change: 15,
      changeColor: 'text-green-600',
      icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      bgColor: 'bg-green-500'
    },
    {
      label: 'Kg Reciclados',
      value: '156',
      change: 8,
      changeColor: 'text-green-600',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      bgColor: 'bg-blue-500'
    },
    {
      label: 'Puntos Ganados',
      value: '1,250',
      change: 22,
      changeColor: 'text-green-600',
      icon: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
      bgColor: 'bg-yellow-500'
    }
  ];

  collections = [
    {
      date: '10 Dic 2024',
      type: 'Orgánicos',
      weight: 5,
      points: 30,
      status: 'Completada',
      statusColor: 'bg-green-100 text-green-800',
      typeColor: 'bg-green-500',
      typeIcon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    },
    {
      date: '8 Dic 2024',
      type: 'Reciclables',
      weight: 12,
      points: 50,
      status: 'Completada',
      statusColor: 'bg-green-100 text-green-800',
      typeColor: 'bg-blue-500',
      typeIcon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    },
    {
      date: '5 Dic 2024',
      type: 'Peligrosos',
      weight: 2,
      points: 100,
      status: 'Completada',
      statusColor: 'bg-green-100 text-green-800',
      typeColor: 'bg-red-500',
      typeIcon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    {
      date: '15 Dic 2024',
      type: 'Reciclables',
      weight: 8,
      points: 50,
      status: 'Programada',
      statusColor: 'bg-blue-100 text-blue-800',
      typeColor: 'bg-blue-500',
      typeIcon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    }
  ];

  monthlyProgress = [
    {
      label: 'Recolecciones',
      current: 8,
      target: 12,
      percentage: 67,
      color: 'bg-green-500'
    },
    {
      label: 'Kg Objetivo',
      current: 45,
      target: 60,
      percentage: 75,
      color: 'bg-blue-500'
    },
    {
      label: 'Puntos Meta',
      current: 420,
      target: 500,
      percentage: 84,
      color: 'bg-yellow-500'
    }
  ];

  environmentalImpact = [
    {
      label: 'CO2 Reducido',
      value: '45kg',
      description: 'Equivale a plantar 2 árboles',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
      bgColor: 'bg-green-500'
    },
    {
      label: 'Agua Ahorrada',
      value: '120L',
      description: 'Suficiente para 2 duchas',
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547A1.934 1.934 0 004 16.684v.684A2 2 0 006 19.368h.684a2 2 0 001.962-1.608l.405-2.03a6 6 0 013.86-.517l.318.158a6 6 0 003.86.517l2.386.477A2 2 0 0020 15.368v-.684a1.934 1.934 0 00-.572-1.256z',
      bgColor: 'bg-blue-500'
    },
    {
      label: 'Energía Ahorrada',
      value: '25kWh',
      description: 'Iluminar casa por 3 días',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      bgColor: 'bg-yellow-500'
    }
  ];

  achievements = [
    {
      title: 'Eco Warrior',
      description: '10 recolecciones completadas'
    },
    {
      title: 'Reciclador Pro',
      description: '50kg de materiales reciclados'
    },
    {
      title: 'Streak Master',
      description: '7 días consecutivos activo'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      period: ['month'],
      wasteType: [''],
      status: ['']
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    console.log('Aplicando filtros:', filters);
    // Aquí implementarías la lógica de filtrado
  }
}
