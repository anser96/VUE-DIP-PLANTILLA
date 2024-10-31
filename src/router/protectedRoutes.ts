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
}

function createCrudRoutes(configs: CrudRouteConfig[]): RouteRecordRaw[] {
  return configs.map(({ basePath, listComponent, formComponent }) => ({
    path: `/${basePath}`,
    name: `${basePath.charAt(0).toUpperCase() + basePath.slice(1)}`,
    component: listComponent,
    meta: { breadcrumb: `${basePath.charAt(0).toUpperCase() + basePath.slice(1)}`, showInSidebar: true, isChild: false },
    children: [
      {
        path: 'create',
        name: `${basePath}Create`,
        component: formComponent,
        meta: { breadcrumb: `Crear ${basePath}`, showInSidebar: false, isChild: true },
        props: { mode: 'create' },
      },
      {
        path: ':id',
        name: `${basePath}View`,
        component: formComponent,
        meta: { breadcrumb: `Ver ${basePath}`, showInSidebar: false, isChild: true },
        props: { mode: 'view' },
      },
      {
        path: 'edit/:id',
        name: `${basePath}Edit`,
        component: formComponent,
        meta: { breadcrumb: `Editar ${basePath}`, showInSidebar: false, isChild: true },
        props: { mode: 'edit' },
      },
    ],
  }));
}

const crudConfigs: CrudRouteConfig[] = [
  { basePath: 'tasks', listComponent: TasksList, formComponent: TaskAssignmentsForm },
  { basePath: 'requests', listComponent: RequestsList, formComponent: RequestsForm },
  { basePath: 'sessions', listComponent: SessionsList, formComponent: SessionsForm },
  { basePath: 'members', listComponent: MembersList, formComponent: MembersForm },
  { basePath: 'applicants', listComponent: ApplicantsList, formComponent: ApplicantsForm },
  { basePath: 'guests', listComponent: GuestsList, formComponent: GuestsCreate },
  { basePath: 'propositions', listComponent: PropositionsList, formComponent: PropositionsCreate },
  { basePath: 'acts', listComponent: ActsList, formComponent: ActsForm },
  { basePath: 'attendance', listComponent: AttendanceList, formComponent: AttendanceForm },
  { basePath: 'attendance-members', listComponent: AttendanceMembersList, formComponent: AttendanceMembersForm },
  { basePath: 'descriptions', listComponent: DescriptionList, formComponent: DescriptionForm },
  { basePath: 'task-assignments', listComponent: TaskAssignmentsList, formComponent: TaskAssignmentsForm },
  { basePath: 'session-order', listComponent: SessionOrderList, formComponent: SessionOrderForm },
];

export const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { breadcrumb: 'Inicio', showInSidebar: true, isChild: false },
  },
  ...createCrudRoutes(crudConfigs),
];
