import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type CategoryId = 'all' | 'products' | 'discounts' | 'experiences' | 'donations';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewardsComponent {
  userPoints = 1250;
  selectedCategory: CategoryId = 'all';

  categories: { id: CategoryId; name: string }[] = [
    { id: 'all',         name: 'Todos' },
    { id: 'products',    name: 'Productos Eco' },
    { id: 'discounts',   name: 'Descuentos' },
    { id: 'experiences', name: 'Experiencias' },
    { id: 'donations',   name: 'Donaciones' }
  ];

  rewards = [
    { id: 1, name: 'Botella de Agua Reutilizable', description: 'Botella de acero inoxidable de 500ml, libre de BPA', points: 200, category: 'Productos Eco', categoryColor: 'bg-green-100 text-green-800', image: '/eco-friendly-water-bottle.png', stock: 15, type: 'products' },
    { id: 2, name: 'Kit de Bolsas Reutilizables', description: 'Set de 5 bolsas de diferentes tamaños para compras', points: 150, category: 'Productos Eco', categoryColor: 'bg-green-100 text-green-800', image: '/placeholder-d9oy8.png', stock: 8, type: 'products' },
    { id: 3, name: '20% Descuento en Tienda Verde', description: 'Descuento aplicable en productos orgánicos y sostenibles', points: 300, category: 'Descuentos', categoryColor: 'bg-blue-100 text-blue-800', image: '/organic-store-discount.png', stock: 50, discount: 20, type: 'discounts' },
    { id: 4, name: 'Taller de Compostaje', description: 'Aprende a crear tu propio compost en casa', points: 400, category: 'Experiencias', categoryColor: 'bg-purple-100 text-purple-800', image: '/composting-workshop.png', stock: 12, type: 'experiences' },
    { id: 5, name: 'Donación a Reforestación', description: 'Contribuye a plantar 5 árboles nativos', points: 500, category: 'Donaciones', categoryColor: 'bg-yellow-100 text-yellow-800', image: '/tree-planting-donation.png', stock: 100, type: 'donations' },
    { id: 6, name: 'Cepillo de Dientes Bambú', description: 'Cepillo biodegradable con cerdas naturales', points: 100, category: 'Productos Eco', categoryColor: 'bg-green-100 text-green-800', image: '/placeholder-ula42.png', stock: 25, type: 'products' },
    { id: 7, name: 'Curso Online de Sostenibilidad', description: 'Certificación en prácticas ambientales sostenibles', points: 600, category: 'Experiencias', categoryColor: 'bg-purple-100 text-purple-800', image: '/sustainability-online-course.png', stock: 30, type: 'experiences' },
    { id: 8, name: '15% Descuento en Bicicletas', description: 'Descuento en tienda de bicicletas ecológicas', points: 800, category: 'Descuentos', categoryColor: 'bg-blue-100 text-blue-800', image: '/bicycle-store-discount.png', stock: 20, discount: 15, type: 'discounts' },
    { id: 9, name: 'Semillas Orgánicas', description: 'Pack de semillas para huerto urbano', points: 120, category: 'Productos Eco', categoryColor: 'bg-green-100 text-green-800', image: '/organic-seeds-pack.png', stock: 0, type: 'products' }
  ];

  recentRedemptions = [
    { name: 'Botella Reutilizable', points: 200, date: '5 Dic 2024', image: '/reusable-water-bottle.png' },
    { name: 'Kit de Bolsas',        points: 150, date: '1 Dic 2024', image: '/colorful-shopping-bags.png' },
    { name: 'Descuento Tienda',     points: 300, date: '28 Nov 2024', image: '/discount-coupon.png' }
  ];

  waysToEarn = [
    { action: 'Recolección Orgánicos',   points: 30,  icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', bgColor: 'bg-green-500' },
    { action: 'Recolección Reciclables', points: 50,  icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', bgColor: 'bg-blue-500' },
    { action: 'Recolección Peligrosos',  points: 100, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', bgColor: 'bg-red-500' },
    { action: 'Referir Amigos',          points: 200, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', bgColor: 'bg-purple-500' }
  ];

  /** Lista filtrada estable (no getters en template) */
  filteredRewards = this.rewards;

  constructor() {
    this.applyFilter();
  }

  selectCategory(categoryId: CategoryId) {
    this.selectedCategory = categoryId;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredRewards = this.selectedCategory === 'all'
      ? this.rewards
      : this.rewards.filter(r => r.type === this.selectedCategory);
  }

  /** trackBy para evitar recrear DOM innecesariamente */
  trackByReward = (_: number, r: any) => r.id;
  trackByCategory = (_: number, c: { id: CategoryId }) => c.id;

  redeemReward(reward: any) {
    if (reward.points > this.userPoints || reward.stock === 0) return;

    const confirmed = confirm(`¿Confirmas el canje de "${reward.name}" por ${reward.points} puntos?`);
    if (!confirmed) return;

    this.userPoints -= reward.points;
    reward.stock -= 1;

    this.recentRedemptions.unshift({
      name: reward.name,
      points: reward.points,
      date: new Date().toLocaleDateString('es-ES'),
      image: reward.image
    });

    if (this.recentRedemptions.length > 3) this.recentRedemptions.pop();

    alert(`¡Canje exitoso! Has canjeado "${reward.name}". Te contactaremos pronto con los detalles.`);
  }
}
