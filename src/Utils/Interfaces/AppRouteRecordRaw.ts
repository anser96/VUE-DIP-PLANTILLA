import { RouteRecordRaw } from 'vue-router';

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: {
    breadcrumb?: string;
    showInSidebar?: boolean;
  };
  children?: AppRouteRecordRaw[];
}