import { Routes } from '@angular/router';
import { Home } from './pages/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Valentin Boudigues — Développeur Full Stack' },
  { path: 'projets/:slug', loadComponent: () => import('./pages/project-detail').then((m) => m.ProjectDetail) },
  { path: '**', redirectTo: '' },
];
