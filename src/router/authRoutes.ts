import { RouteRecordRaw } from 'vue-router';
import ForgotPassword from '../modules/auth/ForgotPassword.vue';
import Login from '../modules/auth/Login.vue';
import Register from '../modules/auth/Register.vue';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
];
