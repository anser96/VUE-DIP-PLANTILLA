import { createRouter, createWebHistory } from 'vue-router';

// Importar las vistas
import Home from '../views/Home.vue';
import TasksList from '../modules/tasks/TasksList.vue';
import TasksCreate from '../modules/tasks/TasksCreate.vue';
import RequestsList from '../modules/requests/RequestsList.vue';
import SessionsList from '../modules/sessions/SessionsList.vue';

// Definir rutas con sus metas para breadcrumbs
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      breadcrumb: 'Home',
    },
  },
  {
    path: '/tasks',
    name: 'TasksList',
    component: TasksList,
    meta: {
      breadcrumb: 'Tasks',
    },
  },
  {
    path: '/tasks/create',
    name: 'TasksCreate',
    component: TasksCreate,
    meta: {
      breadcrumb: 'Create Task',
    },
  },
  {
    path: '/requests',
    name: 'RequestsList',
    component: RequestsList,
    meta: {
      breadcrumb: 'Requests',
    },
  },
  {
    path: '/sessions',
    name: 'SessionsList',
    component: SessionsList,
    meta: {
      breadcrumb: 'Sessions',
    },
  },
  // Otras rutas...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
