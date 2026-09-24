import { inject } from '@angular/core'
import { ResolveFn, Routes } from '@angular/router'
import { User } from '@supabase/supabase-js'
import { Supabase } from './core/supabase/supabase'
import { authGuard, guestGuard } from './core/auth-guard/auth.guard'

const userResolver: ResolveFn<User | null> = () => inject(Supabase).getUser()

export const routes: Routes = [
  { path: 'login', canActivate: [guestGuard],
    loadComponent: () => import('./auth/login').then(m => m.Login) },
  { path: 'account', canActivate: [authGuard], resolve: { user: userResolver },
    loadComponent: () => import('./account/account').then(m => m.Account) },
  { path: '', pathMatch: 'full', redirectTo: 'account' },
  { path: '**', redirectTo: 'account' },
]
