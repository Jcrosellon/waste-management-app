import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Panel de Administrador</h1>
          <p class="text-gray-600 mt-2">Gestiona solicitudes de recolección y supervisa las operaciones</p>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div *ngFor="let stat of adminStats" class="bg-white rounded-lg shadow p-6">
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
                  {{ Math.abs(stat.change) }}%
                </span>
                <span class="text-gray-500 ml-2">vs semana anterior</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Pending Requests -->
            <div class="bg-white rounded-lg shadow">
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">Solicitudes Pendientes</h2>
                <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {{ pendingRequests.length }} pendientes
                </span>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let request of pendingRequests">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">{{ request.client.charAt(0) }}</span>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ request.client }}</div>
                            <div class="text-sm text-gray-500">{{ request.address }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [ngClass]="request.typeColor" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ request.type }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{{ request.date }}</div>
                        <div class="text-gray-500">{{ request.time }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ request.weight }} kg</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button (click)="approveRequest(request.id)"
                                class="text-green-600 hover:text-green-900">Aprobar</button>
                        <button (click)="rejectRequest(request.id)"
                                class="text-red-600 hover:text-red-900">Rechazar</button>
                        <button (click)="viewDetails(request.id)"
                                class="text-blue-600 hover:text-blue-900">Ver</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Today's Schedule -->
            <div class="bg-white rounded-lg shadow">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Agenda de Hoy</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div *ngFor="let appointment of todaySchedule" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div [ngClass]="appointment.statusColor" class="w-3 h-3 rounded-full mr-3"></div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ appointment.client }}</p>
                        <p class="text-xs text-gray-500">{{ appointment.address }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-900">{{ appointment.time }}</p>
                      <p class="text-xs text-gray-500">{{ appointment.type }} - {{ appointment.weight }}kg</p>
                    </div>
                    <div class="flex space-x-2">
                      <button (click)="markCompleted(appointment.id)"
                              class="text-green-600 hover:text-green-900 text-sm">Completar</button>
                      <button (click)="reschedule(appointment.id)"
                              class="text-blue-600 hover:text-blue-900 text-sm">Reprogramar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div class="space-y-3">
                <button *ngFor="let action of quickActions"
                        (click)="executeAction(action.id)"
                        class="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div [ngClass]="action.bgColor" class="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path [attr.d]="action.icon"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ action.title }}</p>
                    <p class="text-xs text-gray-500">{{ action.description }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Team Status -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Estado del Equipo</h3>
              <div class="space-y-3">
                <div *ngFor="let member of teamMembers" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span class="text-xs font-medium text-gray-700">{{ member.name.charAt(0) }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                      <p class="text-xs text-gray-500">{{ member.role }}</p>
                    </div>
                  </div>
                  <span [ngClass]="member.statusColor" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ member.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
              <div class="space-y-3">
                <div *ngFor="let activity of recentActivity" class="flex items-start">
                  <div [ngClass]="activity.bgColor" class="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path [attr.d]="activity.icon"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-xs text-gray-500">{{ activity.description }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Alerts -->
            <div class="bg-red-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-red-900 mb-4">Alertas del Sistema</h3>
              <div class="space-y-3">
                <div *ngFor="let alert of systemAlerts" class="flex items-start">
                  <svg class="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-red-900">{{ alert.title }}</p>
                    <p class="text-xs text-red-700">{{ alert.message }}</p>
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
export class AdminComponent {
  Math = Math;

  adminStats = [
    {
      label: 'Solicitudes Pendientes',
      value: '12',
      change: -8,
      changeColor: 'text-green-600',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      bgColor: 'bg-orange-500'
    },
    {
      label: 'Recolecciones Hoy',
      value: '28',
      change: 12,
      changeColor: 'text-green-600',
      icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      bgColor: 'bg-green-500'
    },
    {
      label: 'Usuarios Activos',
      value: '1,247',
      change: 5,
      changeColor: 'text-green-600',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      bgColor: 'bg-blue-500'
    },
    {
      label: 'Eficiencia',
      value: '94%',
      change: 3,
      changeColor: 'text-green-600',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bgColor: 'bg-purple-500'
    }
  ];

  pendingRequests = [
    {
      id: 1,
      client: 'María González',
      address: 'Av. Principal 123',
      type: 'Orgánicos',
      typeColor: 'bg-green-100 text-green-800',
      date: '15 Dic 2024',
      time: '9:00 AM',
      weight: 5
    },
    {
      id: 2,
      client: 'Carlos Rodríguez',
      address: 'Calle 45 #67-89',
      type: 'Reciclables',
      typeColor: 'bg-blue-100 text-blue-800',
      date: '15 Dic 2024',
      time: '2:00 PM',
      weight: 12
    },
    {
      id: 3,
      client: 'Ana Martínez',
      address: 'Carrera 12 #34-56',
      type: 'Peligrosos',
      typeColor: 'bg-red-100 text-red-800',
      date: '16 Dic 2024',
      time: '10:30 AM',
      weight: 3
    }
  ];

  todaySchedule = [
    {
      id: 1,
      client: 'Juan Pérez',
      address: 'Calle 123 #45-67',
      time: '8:00 AM',
      type: 'Orgánicos',
      weight: 4,
      statusColor: 'bg-green-500'
    },
    {
      id: 2,
      client: 'Laura Silva',
      address: 'Av. Central 890',
      time: '10:30 AM',
      type: 'Reciclables',
      weight: 8,
      statusColor: 'bg-yellow-500'
    },
    {
      id: 3,
      client: 'Pedro López',
      address: 'Calle 56 #78-90',
      time: '2:00 PM',
      type: 'Peligrosos',
      weight: 2,
      statusColor: 'bg-blue-500'
    }
  ];

  quickActions = [
    {
      id: 'assign-route',
      title: 'Asignar Rutas',
      description: 'Optimizar rutas de recolección',
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      bgColor: 'bg-blue-500'
    },
    {
      id: 'generate-report',
      title: 'Generar Reporte',
      description: 'Crear reporte diario',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      bgColor: 'bg-green-500'
    },
    {
      id: 'send-notifications',
      title: 'Enviar Notificaciones',
      description: 'Recordatorios a usuarios',
      icon: 'M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 012 6.414V17a1 1 0 001 1h10.586a1 1 0 00.707-.293l.707-.707A3 3 0 0016 15.5V12h1v3.5a4 4 0 01-1.172 2.828L15.828 19.828A4 4 0 0113 21H3a3 3 0 01-3-3V6.414a3 3 0 01.879-2.121l.949-.949z',
      bgColor: 'bg-purple-500'
    },
    {
      id: 'manage-inventory',
      title: 'Gestionar Inventario',
      description: 'Control de materiales',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      bgColor: 'bg-orange-500'
    }
  ];

  teamMembers = [
    {
      name: 'Carlos Ruiz',
      role: 'Conductor',
      status: 'En Ruta',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'Ana Torres',
      role: 'Supervisora',
      status: 'Disponible',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Luis Morales',
      role: 'Conductor',
      status: 'Descanso',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      name: 'Sofia Vargas',
      role: 'Coordinadora',
      status: 'En Oficina',
      statusColor: 'bg-purple-100 text-purple-800'
    }
  ];

  recentActivity = [
    {
      title: 'Recolección Completada',
      description: 'María González - Orgánicos 5kg',
      time: 'Hace 15 min',
      icon: 'M5 13l4 4L19 7',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Nueva Solicitud',
      description: 'Pedro Sánchez - Reciclables',
      time: 'Hace 30 min',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Ruta Optimizada',
      description: 'Zona Norte - 8 paradas',
      time: 'Hace 1 hora',
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      bgColor: 'bg-purple-500'
    }
  ];

  systemAlerts = [
    {
      title: 'Vehículo en Mantenimiento',
      message: 'Camión #3 requiere revisión técnica'
    },
    {
      title: 'Capacidad Límite',
      message: 'Centro de acopio al 85% de capacidad'
    },
    {
      title: 'Retraso en Ruta',
      message: 'Ruta Norte con 20 min de retraso'
    }
  ];

  approveRequest(id: number) {
    const request = this.pendingRequests.find(r => r.id === id);
    if (request) {
      alert(`Solicitud de ${request.client} aprobada. Se ha programado la recolección.`);
      this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
    }
  }

  rejectRequest(id: number) {
    const request = this.pendingRequests.find(r => r.id === id);
    if (request) {
      const reason = prompt('Motivo del rechazo:');
      if (reason) {
        alert(`Solicitud de ${request.client} rechazada. Motivo: ${reason}`);
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
      }
    }
  }

  viewDetails(id: number) {
    const request = this.pendingRequests.find(r => r.id === id);
    if (request) {
      alert(`Detalles de la solicitud:\nCliente: ${request.client}\nDirección: ${request.address}\nTipo: ${request.type}\nFecha: ${request.date}\nHora: ${request.time}\nCantidad: ${request.weight}kg`);
    }
  }

  markCompleted(id: number) {
    const appointment = this.todaySchedule.find(a => a.id === id);
    if (appointment) {
      alert(`Recolección de ${appointment.client} marcada como completada.`);
      this.todaySchedule = this.todaySchedule.filter(a => a.id !== id);
    }
  }

  reschedule(id: number) {
    const appointment = this.todaySchedule.find(a => a.id === id);
    if (appointment) {
      const newTime = prompt('Nueva hora (ej: 3:00 PM):');
      if (newTime) {
        appointment.time = newTime;
        alert(`Cita de ${appointment.client} reprogramada para ${newTime}.`);
      }
    }
  }

  executeAction(actionId: string) {
    const action = this.quickActions.find(a => a.id === actionId);
    if (action) {
      alert(`Ejecutando: ${action.title}`);
    }
  }
}
