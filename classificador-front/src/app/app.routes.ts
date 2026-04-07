import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { AppShellComponent } from './shared/components/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: '',
    component: AppShellComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'incidents',
        loadComponent: () =>
          import('./features/incidents/list/incidents-list.component').then(
            (m) => m.IncidentsListComponent
          )
      },
      {
        path: 'incidents/new',
        loadComponent: () =>
          import('./features/incidents/create/incident-create.component').then(
            (m) => m.IncidentCreateComponent
          )
      },
      {
        path: 'incidents/:id',
        loadComponent: () =>
          import('./features/incidents/detail/incident-detail.component').then(
            (m) => m.IncidentDetailComponent
          )
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
