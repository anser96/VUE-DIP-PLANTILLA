import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import TasksList from '../modules/tasks/TasksList.vue';
import TasksCreate from '../modules/tasks/TasksCreate.vue';
import RequestsList from '../modules/requests/RequestsList.vue';
import SessionsList from '../modules/sessions/SessionsList.vue';
import SessionsForm from '../modules/sessions/SessionsForm.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      breadcrumb: 'Inicio',
      showInSidebar: true,
      isChild: false,
    },
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TasksList,
    meta: {
      breadcrumb: 'Tareas',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'TasksCreate',
        component: TasksCreate,
        meta: {
          breadcrumb: 'Crear Tarea',
          showInSidebar: true,
          isChild: true,
        },
      },
    ],
  },
  {
    path: '/requests',
    name: 'Requests',
    component: RequestsList,
    meta: {
      breadcrumb: 'Solicitudes',
      showInSidebar: true,
      isChild: false,
    },
  },
  {
    path: '/sessions',
    name: 'Sessions',
    component: SessionsList,
    meta: {
      breadcrumb: 'Sesiones',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'SessionsCreate',
        component: SessionsForm, // Usar el mismo componente para crear
        meta: {
          breadcrumb: 'Crear Sesión',
          showInSidebar: true,
          isChild: true,
        },
        props: { mode: 'create' }, // Enviar prop para indicar el modo de creación
      },
      {
        path: ':id',
        name: 'SessionsView',
        component: SessionsForm, // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Sesión',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' }, // Enviar prop para indicar el modo de visualización
      },
      {
        path: 'edit/:id',
        name: 'SessionsEdit',
        component: SessionsForm, // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Sesión',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' }, // Enviar prop para indicar el modo de edición
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
