import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { authGuard } from '../services/auth';


export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', component: Home },
        ],
    },
    { path: '**', redirectTo: '' },
];
