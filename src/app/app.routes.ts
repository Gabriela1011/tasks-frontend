import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Search } from './search/search';
import { Tasks } from './tasks/tasks';

export const routes: Routes = [
    {path: 'home', component: Homepage},
    {path: 'search', component: Search},
    {path: 'myTasks', component: Tasks},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    // {path: '**', component: NotFoundComponent}
];
