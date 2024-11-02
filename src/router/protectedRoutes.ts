import { RouteRecordRaw } from 'vue-router';
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
import ActsForm from '../modules/acts/ActsCreate.vue';
import AttendanceList from '../modules/attendance_guests/AttendanceList.vue';
import AttendanceForm from '../modules/attendance_guests/AttendanceCreate.vue';
import AttendanceMembersList from '../modules/attendance_members/MembersList.vue';
import AttendanceMembersForm from '../modules/attendance_members/MembersCreate.vue';
import DescriptionList from '../modules/description/descriptionList.vue';
import DescriptionForm from '../modules/description/descriptionForm.vue';
import TaskAssignmentsList from '../modules/task-assignments/TaskAssignmentsList.vue';
import SessionOrderList from '../modules/sessionOrder/SessionOrderList.vue';
import SessionOrderForm from '../modules/sessionOrder/SessionOrderForm.vue';

// Definir la interfaz para las rutas CRUD
interface CrudRouteConfig {
  basePath: string;
  listComponent: any;
  formComponent: any;
  RouteName: string;
}

function createCrudRoutes(configs: CrudRouteConfig[]): RouteRecordRaw[] {
  return configs.map(({ basePath, listComponent, formComponent, RouteName: spanishName }) => ({
    path: `/${basePath}`,
    name: `${spanishName}`,
    component: listComponent,
    meta: { breadcrumb: `${spanishName}`, showInSidebar: true, isChild: false },
    children: [
      {
        path: 'crear',
        name: `${spanishName}Crear`,
        component: formComponent,
        meta: { breadcrumb: `Crear ${spanishName}`, showInSidebar: false, isChild: true },
        props: { mode: 'create' },
      },
      {
        path: ':id',
        name: `${spanishName}Ver`,
        component: formComponent,
        meta: { breadcrumb: `Ver ${spanishName}`, showInSidebar: false, isChild: true },
        props: { mode: 'view' },
      },
      {
        path: 'editar/:id',
        name: `${spanishName}Editar`,
        component: formComponent,
        meta: { breadcrumb: `Editar ${spanishName}`, showInSidebar: false, isChild: true },
        props: { mode: 'edit' },
      },
    ],
  }));
}

const crudConfigs: CrudRouteConfig[] = [
  { basePath: 'tasks', listComponent: TasksList, formComponent: TaskAssignmentsForm, RouteName: 'Tareas' },
  { basePath: 'requests', listComponent: RequestsList, formComponent: RequestsForm, RouteName: 'Solicitudes' },
  { basePath: 'sessions', listComponent: SessionsList, formComponent: SessionsForm, RouteName: 'Sesiones' },
  { basePath: 'members', listComponent: MembersList, formComponent: MembersForm, RouteName: 'Miembros' },
  { basePath: 'applicants', listComponent: ApplicantsList, formComponent: ApplicantsForm, RouteName: 'Solicitantes' },
  { basePath: 'guests', listComponent: GuestsList, formComponent: GuestsCreate, RouteName: 'Invitados' },
  { basePath: 'propositions', listComponent: PropositionsList, formComponent: PropositionsCreate, RouteName: 'Proposiciones' },
  { basePath: 'acts', listComponent: ActsList, formComponent: ActsForm, RouteName: 'Actas' },
  { basePath: 'attendance', listComponent: AttendanceList, formComponent: AttendanceForm, RouteName: 'Asistencia' },
  { basePath: 'attendance-members', listComponent: AttendanceMembersList, formComponent: AttendanceMembersForm, RouteName: 'Asistencia Miembros' },
  { basePath: 'descriptions', listComponent: DescriptionList, formComponent: DescriptionForm, RouteName: 'Descripciones' },
  { basePath: 'task-assignments', listComponent: TaskAssignmentsList, formComponent: TaskAssignmentsForm, RouteName: 'Asignaciones de Tareas' },
  { basePath: 'session-order', listComponent: SessionOrderList, formComponent: SessionOrderForm, RouteName: 'Orden de Sesión' },
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