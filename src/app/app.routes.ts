import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    children: [
      {path:'', pathMatch: 'full', redirectTo: 'home'},
      {
        path: 'home',
        loadComponent: () => import('./components/home/home').then((m) => m.Home),
      },
    ]
  }
];
