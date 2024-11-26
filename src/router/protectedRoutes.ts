import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import TasksList from '../modules/tasks/TasksList.vue';
import TaskAssignmentsForm from '../modules/task-assignments/TaskAssignmentsForm.vue';
import RequestsList from '../modules/requests/RequestsList.vue';
import RequestsForm from '../modules/requests/RequestsCreate.vue';
import SessionsList from '../modules/sessions/SessionsList.vue';
import SessionsForm from '../modules/sessions/SessionsForm.vue';
import MembersList from '../modules/members/MembersList.vue';
import MembersForm from '../modules/members/MembersCreate.vue';
import ApplicantsList from '../modules/applicants/ApplicantsList.vue';
import ApplicantsForm from '../modules/applicants/ApplicantsCreate.vue';
import GuestsList from '../modules/guests/GuestsList.vue';
import GuestsCreate from '../modules/guests/GuestsCreate.vue';
import PropositionsList from '../modules/propositions/PropositionsList.vue';
import PropositionsCreate from '../modules/propositions/PropositionsCreate.vue';
import ActsList from '../modules/acts/ActsList.vue';
import AttendanceList from '../modules/attendance_guests/AttendanceList.vue';
import AttendanceForm from '../modules/attendance_guests/AttendanceCreate.vue';
import DescriptionList from '../modules/description/descriptionList.vue';
import DescriptionForm from '../modules/description/descriptionForm.vue';
import TaskAssignmentsList from '../modules/task-assignments/TaskAssignmentsList.vue';
import SessionOrderList from '../modules/sessionOrder/SessionOrderList.vue';
import SessionOrderForm from '../modules/sessionOrder/SessionOrderForm.vue';
import ActsDetail from '../modules/acts/ActsDetail.vue';
import SoliEdit from '../modules/requests/RequestsEdit.vue'
import { useAuthStore } from '../store/auth';

// Definir la interfaz para las rutas CRUD
// Definir la interfaz para las rutas CRUD
interface CrudRouteConfig {
  basePath: string;
  listComponent: any;
  formComponent: any;
  EditComponent?: any;
  RouteName: string;
  detailComponent?: any;
  allowedRoles?: string[]; // Agregar un campo opcional para roles permitidos
}

function createCrudRoutes(configs: CrudRouteConfig[]): RouteRecordRaw[] {

  return configs.map(({ basePath, listComponent, formComponent, EditComponent, RouteName: spanishName, detailComponent, allowedRoles }) => {
    // Determinar si el rol del usuario está permitido
    // Obtener el rol del usuario desde localStorage
    const storedAuth = localStorage.getItem('auth');
    let rol: string | null = null;

    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        rol = parsedAuth.usuario?.rol || null; // Accede al rol del usuario si está disponible
      } catch (error) {
        console.error('Error al parsear los datos de autenticación:', error);
      }
    }

    // Verificar si el rol está permitido
    const isAllowed = allowedRoles ? allowedRoles.includes(rol || '') : true;

    return {
      path: `/${basePath}`,
      name: `${spanishName}`,
      component: listComponent,
      meta: { 
        breadcrumb: `${spanishName}`, 
        showInSidebar: isAllowed, // Mostrar u ocultar en el sidebar según la autorización del usuario
        isChild: false,
        allowedRoles // Roles permitidos
      },
      children: [
        {
          path: 'create',
          name: `${spanishName}Crear`,
          component: formComponent,
          meta: { 
            breadcrumb: `Crear ${spanishName}`, 
            showInSidebar: false, // Mostrar u ocultar en el sidebar según la autorización del usuario
            isChild: true,
            allowedRoles // Roles permitidos
          },
          props: { mode: 'create' },
        },
        {
          path: ':id',
          name: `${spanishName}Ver`,
          component: detailComponent || formComponent, // Usa detailComponent si está definido
          meta: { 
            breadcrumb: `Ver ${spanishName}`, 
            showInSidebar: false, // Mostrar u ocultar en el sidebar según la autorización del usuario
            isChild: true,
            allowedRoles // Roles permitidos
          },
          props: { mode: 'view' },
        },
        {
          path: 'edit/:id',
          name: `${spanishName}Editar`,
          component: formComponent,
          meta: { 
            breadcrumb: `Editar ${spanishName}`, 
            showInSidebar: false, // Mostrar u ocultar en el sidebar según la autorización del usuario
            isChild: true,
            allowedRoles // Roles permitidos
          },
          props: { mode: 'edit' },
        },

      ],
    };
  });
}


const crudConfigs: CrudRouteConfig[] = [
  { basePath: 'tasks', listComponent: TasksList, formComponent: TaskAssignmentsForm, RouteName: 'Tareas', allowedRoles: ['ADMINISTRADOR', 'MODERADOR'] },
  { basePath: 'requests', listComponent: RequestsList, formComponent: RequestsForm, EditComponent: SoliEdit, RouteName: 'Solicitudes', allowedRoles: ['ADMINISTRADOR', 'INTEGRANTECOMITE'] },
  { basePath: 'sessions', listComponent: SessionsList, formComponent: SessionsForm, RouteName: 'Sesiones', allowedRoles: ['SECRETARIO', 'ADMINISTRADOR'] },
  { basePath: 'members', listComponent: MembersList, formComponent: MembersForm, RouteName: 'Miembros', allowedRoles: ['ADMINISTRADOR'] },
  { basePath: 'applicants', listComponent: ApplicantsList, formComponent: ApplicantsForm, RouteName: 'Solicitantes', allowedRoles: ['SECRETARIO'] },
  { basePath: 'guests', listComponent: GuestsList, formComponent: GuestsCreate, RouteName: 'Invitados', allowedRoles: ['MODERADOR', 'ADMINISTRADOR'] },
  { basePath: 'propositions', listComponent: PropositionsList, formComponent: PropositionsCreate, RouteName: 'Proposiciones', allowedRoles: ['INTEGRANTECOMITE'] },
  { basePath: 'acts', listComponent: ActsList, formComponent: null, detailComponent: ActsDetail, RouteName: 'Actas', allowedRoles: ['SECRETARIO', 'ADMINISTRADOR'] },
  { basePath: 'attendance', listComponent: AttendanceList, formComponent: AttendanceForm, RouteName: 'Asistencia', allowedRoles: ['MODERADOR', 'ADMINISTRADOR'] },
  { basePath: 'descriptions', listComponent: DescriptionList, formComponent: DescriptionForm, RouteName: 'Descripciones', allowedRoles: ['ADMINISTRADOR'] },
  { basePath: 'task-assignments', listComponent: TaskAssignmentsList, formComponent: TaskAssignmentsForm, RouteName: 'Asignaciones de Tareas', allowedRoles: ['MODERADOR'] },
  { basePath: 'session-order', listComponent: SessionOrderList, formComponent: SessionOrderForm, RouteName: 'Orden de Sesión', allowedRoles: ['MODERADOR'] },
];


export const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Inicio',
    component: Home,
    meta: { breadcrumb: 'Inicio', showInSidebar: true, isChild: false },
  },
  ...createCrudRoutes(crudConfigs),
];