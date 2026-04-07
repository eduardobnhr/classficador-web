import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'incidents',
    renderMode: RenderMode.Client,
  },
  {
    path: 'incidents/create',
    renderMode: RenderMode.Client,
  },
  {
    path: 'incidents/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
