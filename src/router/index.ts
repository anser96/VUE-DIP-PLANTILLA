import { createRouter, createWebHistory } from 'vue-router';
import HotelDashboardView from '../views/hotels/HotelDashboardView.vue';


const routes = [
  {
    path: '/',
    name: 'home',
    component: HotelDashboardView,  // La vista de inicio ahora será HotelDashboardView
  },
  {
    path: '/hoteles/dashboard',
    name: 'hotel-dashboard',
    component: HotelDashboardView,
  },
  // Otras rutas
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
