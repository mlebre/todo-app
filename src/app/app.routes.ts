import { Routes } from '@angular/router';
import { Home } from './components/home/home.component';
import { DoneListComponent } from './components/done-list/done-list.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'done', component: DoneListComponent },
    { path: '**', redirectTo: '' },
];
