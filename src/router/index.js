import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Ligas from '../views/Ligas.vue';
import DetalleLiga from '../views/DetalleLiga.vue';
import { useUserStore } from '../store/user';
import Plantel from '../views/plantel.vue';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/ligas', name: 'Ligas', component: Ligas, meta: { requiresAuth: true } },
  { path: '/ligas/:id', name: 'DetalleLiga', component: DetalleLiga, props: true, meta: { requiresAuth: true } },
  { path: '/ligas/:id/plantel/:equipo', name: 'Plantel', component: Plantel, props: true, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const store = useUserStore();
  if (to.meta.requiresAuth && !store.user) {
    next('/');
  } else {
    next();
  }
});

export default router;