import type { Routes } from '@angular/router';

import { ROUTE_PATHS } from './utils/constants/router.constants';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTE_PATHS.ListTodos,
    },
    {
        path: ROUTE_PATHS.AddDodo,
        loadComponent: () => import('./pages/add-todo/add-todo').then((m) => m.AddTodo),
    },
    {
        path: ROUTE_PATHS.ListTodos,
        loadComponent: () => import('./pages/list-todos/list-todos').then((m) => m.ListTodos),
    },
    {
        path: '**',
        redirectTo: ROUTE_PATHS.ListTodos,
    },
];
