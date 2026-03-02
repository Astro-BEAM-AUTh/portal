import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register'
import { authGuard } from '../services/auth';


export const routes: Routes = [
    { 
        path: '', 
        component: Home },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'register',
        component: Register
    },
    { 
        path: '**', 
        redirectTo: '' 
    },
];
