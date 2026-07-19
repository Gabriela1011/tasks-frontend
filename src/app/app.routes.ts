import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Search } from './search/search';
import { Tasks } from './tasks/tasks';
import { Auth } from './auth/auth';
import { LoggedInGuardService } from './services/logged-in-guard-service';
import { NotLoggedInGuardService } from './services/not-logged-in-guard-service';

export const routes: Routes = [
    {path: 'home', component: Homepage, canActivate: [LoggedInGuardService]},
    {path: 'search', component: Search, canActivate: [LoggedInGuardService]},
    {path: 'myTasks', component: Tasks, canActivate: [LoggedInGuardService]},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'login', component: Auth, canActivate: [NotLoggedInGuardService]},
    // {path: '**', component: NotFoundComponent}
];
