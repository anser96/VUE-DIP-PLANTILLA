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
import GuestsList from '../modules/guests/GuestsList.vue';
import GuestsCreate from '../modules/guests/GuestsCreate.vue';
import PropositionsList from '../modules/propositions/PropositionsList.vue';
import PropositionsCreate from '../modules/propositions/PropositionsCreate.vue';
import Login from '../modules/login/Login.vue';
import Register from '../modules/login/Register.vue';
import ForgotPassword from '../modules/login/ForgotPassword.vue';
import ActsList from '../modules/acts/ActsList.vue';
import ActsForm from '../modules/acts/ActsCreate.vue';
import AttendanceList from '../modules/attendance_guests/AttendanceList.vue';
import AttendanceForm from '../modules/attendance_guests/AttendanceCreate.vue';
import AttendanceMembersList from '../modules/attendance_members/MembersList.vue'
import AttendanceMembersForm from '../modules/attendance_members/MembersCreate.vue'
import DescriptionList from '../modules/description/descriptionList.vue';
import DescriptionForm from '../modules/description/descriptionForm.vue';
import TaskAssignmentsList from '../modules/task-assignments/TaskAssignmentsList.vue';
import TaskAssignmentsForm from '../modules/task-assignments/TaskAssignmentsForm.vue'; 
import SessionOrderList from '../modules/sessionOrder/SessionOrderList.vue';
import SessionOrderForm from '../modules/sessionOrder/SessionOrderForm.vue';

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
    path: '/login',
    name: 'Login',
    component: Login,
  },
  
  { path: '/register', 
    name: 'Register', 
    component: Register,
  },

  { path: '/forgot-password', 
    name: 'ForgotPassword', 
    component: ForgotPassword,
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
          showInSidebar: false,
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
          showInSidebar: false,
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
          showInSidebar: false,
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
          showInSidebar: false,
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
          showInSidebar: false,
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
  {
    path: '/guests', 
    name: 'Guests',
    component: GuestsList,  // Componente para mostrar
    meta: {
      breadcrumb: 'Invitados',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'guestsCreate',
        component: GuestsCreate,  // Componente para crear
        meta: {
          breadcrumb: 'Crear Invitado',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'create' },
      },
      {
        path: ':id',
        name: 'guestView',
        component: GuestsCreate,  // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Invitado',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' },
      },
      {
        path: 'edit/:id',
        name: 'guestEdit',
        component: GuestsCreate,  // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Invitado',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' },
      },
    ],
  },
  {
    path: '/propositions',  
    name: 'Propositions',
    component: PropositionsList,  // Componente para mostrar
    meta: {
      breadcrumb: 'Proposiciones',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'propositionsCreate',
        component: PropositionsCreate,  // Componente para crear
        meta: {
          breadcrumb: 'Crear Proposición',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'create' },  // Modo creación
      },
      {
        path: ':id',
        name: 'propositionView',
        component: PropositionsCreate,  // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Proposición',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' },  // Modo visualización
      },
      {
        path: 'edit/:id',
        name: 'propositionEdit',
        component: PropositionsCreate,  // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Proposición',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' },  // Modo edición
      },
    ],
  },
  {
    path: '/acts',
    name: 'Acts',
    component: ActsList, // Componente para mostrar la lista de actas
    meta: {
      breadcrumb: 'Actas',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'actsCreate',
        component: ActsForm,
        meta: {
          breadcrumb: 'Crear Acta',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'create' }, // Modo creación
      },
      {
        path: ':id',
        name: 'actView',
        component: ActsForm, // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Acta',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' }, // Modo visualización
      },
      {
        path: 'edit/:id',
        name: 'actEdit',
        component: ActsForm, // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Acta',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' }, // Modo edición
      },
    ],
  }, 
  {
    path: '/attendance',
    name: 'Attendance',
    component: AttendanceList, // Componente para mostrar la lista de asistencias
    meta: {
      breadcrumb: 'Asistencia Invitados',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'attendanceCreate',
        component: AttendanceForm,
        meta: {
          breadcrumb: 'Registrar Asistencia',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'create' }, // Modo creación
      },
      {
        path: ':invId/:sesId',
        name: 'attendanceView',
        component: AttendanceForm, // Usar el mismo componente para ver
        meta: {
          breadcrumb: 'Ver Asistencia',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'view' }, // Modo visualización
      },
      {
        path: 'edit/:invId/:sesId',
        name: 'attendanceEdit',
        component: AttendanceForm, // Usar el mismo componente para editar
        meta: {
          breadcrumb: 'Editar Asistencia',
          showInSidebar: false,
          isChild: true,
        },
        props: { mode: 'edit' }, // Modo edición
      },
    ],
  },  
  {
    path: '/attendance-members',
    name: 'AttendanceMembers',
    component: AttendanceMembersList, // Componente de lista de asistencias de miembros
    meta: {
      breadcrumb: 'Asistencia Miembros',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'AttendanceMembersCreate',
        component: AttendanceMembersForm, // Componente para crear asistencia
        meta: {
          breadcrumb: 'Registrar Asistencia',
          showInSidebar: false,
          isChild: true,
        },
      },
      {
        path: 'edit/:sesId/:memberId',
        name: 'AttendanceMembersEdit',
        component: AttendanceMembersForm, // Componente para editar asistencia
        meta: {
          breadcrumb: 'Editar Asistencia',
          showInSidebar: false,
          isChild: true,
        },
      },
    ],
  }, 
  {
    path: '/descriptions',
    name: 'Descriptions',
    component: DescriptionList, // Componente de lista de descripciones
    meta: {
      breadcrumb: 'Descripciones',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'DescriptionCreate',
        component: DescriptionForm, // Componente para crear descripción
        meta: {
          breadcrumb: 'Crear Descripción',
          showInSidebar: false,
          isChild: true,
        },
      },
      {
        path: 'edit/:id',
        name: 'DescriptionEdit',
        component: DescriptionForm, // Componente para editar descripción
        meta: {
          breadcrumb: 'Editar Descripción',
          showInSidebar: false,
          isChild: true,
        },
      },
    ],
  },
  {
    path: '/task-assignments',
    name: 'TaskAssignments',
    component: TaskAssignmentsList, // Componente de lista de asignaciones de tareas
    meta: {
      breadcrumb: 'Encargados de Tareas',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'TaskAssignmentsCreate',
        component: TaskAssignmentsForm, // Componente para crear asignación de tarea
        meta: {
          breadcrumb: 'Asignar Tarea',
          showInSidebar: false,
          isChild: true,
        },
      },
      {
        path: 'edit/:memberId/:taskId',
        name: 'TaskAssignmentsEdit',
        component: TaskAssignmentsForm, // Componente para editar asignación de tarea
        meta: {
          breadcrumb: 'Editar Asignación de Tarea',
          showInSidebar: false,
          isChild: true,
        },
      },
    ],
  },
  {
    path: '/session-order',
    name: 'SessionOrder',
    component: SessionOrderList, // Componente de lista de orden de sesión
    meta: {
      breadcrumb: 'Orden de Sesión',
      showInSidebar: true,
      isChild: false,
    },
    children: [
      {
        path: 'create',
        name: 'SessionOrderCreate',
        component: SessionOrderForm, // Componente para crear tema de sesión
        meta: {
          breadcrumb: 'Crear Tema de Sesión',
          showInSidebar: false,
          isChild: true,
        },
      },
      {
        path: 'edit/:id',
        name: 'SessionOrderEdit',
        component: SessionOrderForm, // Componente para editar tema de sesión
        meta: {
          breadcrumb: 'Editar Tema de Sesión',
          showInSidebar: false,
          isChild: true,
        },
      },
    ],
  }
        
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
