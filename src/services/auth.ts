import { Injectable, inject, computed, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  supabaseUrl = import.meta.env['NG_APP_SUPABASE_URL']
  supabaseAnonKey = import.meta.env['NG_APP_SUPABASE_ANON_KEY']
  supabase = createClient(
    this.supabaseUrl,
    this.supabaseAnonKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );

  // Start empty; hydrate in constructor
  private sessionSig = signal<Session | null>(null);

  session = computed(() => this.sessionSig());
  isAuthenticated = computed(() => !!this.session());
  user = computed<User | null>(() => this.session()?.user ?? null);

  private sessionLoadedSig = signal<boolean>(false);
  sessionLoaded = computed(() => this.sessionLoadedSig());


  constructor() {
    // 1) Prime from current session once (no await in field init)
    this.supabase.auth.getSession().then(({ data }) => {
      this.sessionSig.set(data.session ?? null);
      this.sessionLoadedSig.set(true);
    });

    // 2) Keep it in sync on changes (login/logout/refresh)
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionSig.set(session);
      this.sessionLoadedSig.set(true);
    });
  }

  signInEmail(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  async sessionOpened() {
    const res = await this.supabase.auth.getSession();
    const session = res['data']['session']
    if (session) {
      return true;
    } else {
      return false;
    }
  }

  Register(email: string, password: string){
    return this.supabase.auth.signUp({ email, password })
  }

  getAccessToken(): string | null {
    const session = this.sessionSig();
    return session?.access_token ?? null;
  }

  getCurrentUserId(){
    const user = this.user();
    return user?.id ?? null;
  }
}




export const authGuard: CanActivateFn = async () => {

  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    return true;
  } else {
    const session = await auth.sessionOpened()
    if (session) {
      return true;
    } else {
      router.navigate(['/login'], { queryParams: { redirectTo: location.pathname } });
      return false;
    }
  }

};

