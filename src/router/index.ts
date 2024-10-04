import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import TasksList from '../modules/tasks/TasksList.vue';
import TasksForm from '../modules/tasks/TasksCreate.vue';
import RequestsList from '../modules/requests/RequestsList.vue';
import RequestsForm from '../modules/requests/RequestsCreate.vue';
import SessionsList from '../modules/sessions/SessionsList.vue';
import SessionsForm from '../modules/sessions/SessionsForm.vue';
import MembersForm from '../modules/members/MembersCreate.vue';
import MembersList from '../modules/members/MembersList.vue';
import ApplicantsForm from '../modules/applicants/ApplicantsCreate.vue';
import ApplicantsList from '../modules/applicants/ApplicantsList.vue';

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
        name: 'tasksCreate',
        component: TasksForm,
        meta: {
          breadcrumb: 'Crear Tarea',
          showInSidebar: true,
          isChild: true,
        },
        props: { mode: 'create' }, // Enviar prop para indicar el modo de creación
      },
      {
        path: ':id',
        name: 'taskView',
        component: TasksForm, // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Tarea',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' }, // Enviar prop para indicar el modo de visualización
      },
      {
        path: 'edit/:id',
        name: 'taskEdit',
        component: TasksForm, // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Tarea',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' }, // Enviar prop para indicar el modo de edición
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
    children: [
      {
        path: 'create',
        name: 'requestsCreate',
        component: RequestsForm,
        meta: {
          breadcrumb: 'Crear Solicitud',
          showInSidebar: true,
          isChild: true,
        },
        props: { mode: 'create' }, // Enviar prop para indicar el modo de creación
      },
      {
        path: ':id',
        name: 'RequestView',
        component: RequestsForm, // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Solicigtud',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' }, // Enviar prop para indicar el modo de visualización
      },
      {
        path: 'edit/:id',
        name: 'RequestEdit',
        component: RequestsForm, // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Solicitud',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' }, // Enviar prop para indicar el modo de edición
      },
    ],
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
  {
    path: '/members',
    name: 'Members',
    component: MembersList,
    meta: {
      breadcrumb: 'Miembros',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'membersCreate',
        component: MembersForm,
        meta: {
          breadcrumb: 'Crear Miembro',
          showInSidebar: true,
          isChild: true,
        },
        props: { mode: 'create' }, // Modo creación
      },
      {
        path: ':id',
        name: 'memberView',
        component: MembersForm, // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Miembro',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' }, // Modo visualización
      },
      {
        path: 'edit/:id',
        name: 'memberEdit',
        component: MembersForm, // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Miembro',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' }, // Modo edición
      },
    ],
  }, 
  {
    path: '/applicants',
    name: 'Applicants',
    component: ApplicantsList,
    meta: {
      breadcrumb: 'Solicitantes',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'applicantsCreate',
        component: ApplicantsForm,
        meta: {
          breadcrumb: 'Crear Solicitante',
          showInSidebar: true,
          isChild: true,
        },
        props: { mode: 'create' }, // Modo creación
      },
      {
        path: ':id',
        name: 'applicantView',
        component: ApplicantsForm, // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Solicitante',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' }, // Modo visualización
      },
      {
        path: 'edit/:id',
        name: 'applicantEdit',
        component: ApplicantsForm, // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Solicitante',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' }, // Modo edición
      },
    ],
  },   
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
