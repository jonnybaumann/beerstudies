import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Supabase } from '../supabase/supabase'

export const authGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router)
  return (await inject(Supabase).isLoggedIn())
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
}

export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router)
  return (await inject(Supabase).isLoggedIn())
    ? router.createUrlTree(['/account'])
    : true
}
