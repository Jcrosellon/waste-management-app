import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Feature {
  title: string;
  description: string;
  icon: string;
}
interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  features: Feature[] = [
    {
      title: 'Programa Recolecciones',
      description: 'Agenda la recolección de tus residuos de forma fácil y conveniente',
      icon: 'M8 7V3a1 1 0 012 0v4h4a1 1 0 010 2h-4v4a1 1 0 01-2 0V9H4a1 1 0 010-2h4z'
    },
    {
      title: 'Gana Puntos',
      description: 'Obtén puntos por cada recolección y contribución al medio ambiente',
      icon: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
    },
    {
      title: 'Canje Recompensas',
      description: 'Intercambia tus puntos por productos eco-friendly y descuentos',
      icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
    }
  ];

  stats: Stat[] = [
    { value: '15,000+', label: 'Usuarios Activos' },
    { value: '50,000kg', label: 'Residuos Reciclados' },
    { value: '2,500', label: 'Recolecciones Mensuales' },
    { value: '95%', label: 'Satisfacción del Usuario' }
  ];

  trackByFeature = (_: number, f: Feature) => f.title;
  trackByStat = (_: number, s: Stat) => s.label;
}
