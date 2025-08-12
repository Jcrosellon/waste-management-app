import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  stats = [
    {
      label: 'Recolecciones',
      value: '24',
      icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      bgColor: 'bg-green-500'
    },
    {
      label: 'Puntos Ganados',
      value: '1,250',
      icon: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
      bgColor: 'bg-yellow-500'
    },
    {
      label: 'Kg Reciclados',
      value: '156',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      bgColor: 'bg-blue-500'
    },
    {
      label: 'Nivel Eco',
      value: 'Gold',
      icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      bgColor: 'bg-purple-500'
    }
  ];

  quickActions = [
    {
      title: 'Programar Recolección',
      description: 'Agenda una nueva recolección',
      icon: 'M8 7V3a1 1 0 012 0v4h4a1 1 0 010 2h-4v4a1 1 0 01-2 0V9H4a1 1 0 010-2h4z',
      bgColor: 'bg-green-500',
      route: '/schedule'
    },
    {
      title: 'Ver Reportes',
      description: 'Consulta tu historial',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      bgColor: 'bg-blue-500',
      route: '/reports'
    },
    {
      title: 'Canjear Puntos',
      description: 'Obtén recompensas',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-yellow-500',
      route: '/rewards'
    },
    {
      title: 'Configuración',
      description: 'Ajusta tus preferencias',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      bgColor: 'bg-gray-500',
      route: '/profile'
    }
  ];

  recentActivity = [
    {
      title: 'Recolección Completada',
      description: 'Residuos orgánicos - 5kg',
      time: 'Hace 2 horas',
      icon: 'M5 13l4 4L19 7',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Puntos Ganados',
      description: '+50 puntos por recolección',
      time: 'Hace 2 horas',
      icon: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
      bgColor: 'bg-yellow-500'
    },
    {
      title: 'Recolección Programada',
      description: 'Reciclables - 15 Dic',
      time: 'Hace 1 día',
      icon: 'M8 7V3a1 1 0 012 0v4h4a1 1 0 010 2h-4v4a1 1 0 01-2 0V9H4a1 1 0 010-2h4z',
      bgColor: 'bg-blue-500'
    }
  ];

  environmentalImpact = [
    {
      label: 'CO2 Reducido',
      value: '45kg',
      percentage: 75,
      color: 'bg-green-500'
    },
    {
      label: 'Agua Ahorrada',
      value: '120L',
      percentage: 60,
      color: 'bg-blue-500'
    },
    {
      label: 'Energía Ahorrada',
      value: '25kWh',
      percentage: 40,
      color: 'bg-yellow-500'
    }
  ];
}
