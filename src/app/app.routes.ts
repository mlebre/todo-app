import { Routes } from '@angular/router';
import { Home } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: '**', redirectTo: '' },
];
