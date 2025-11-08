import { Injectable, inject, computed, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  supabaseUrl = 'https://njgyfhwtjelumutcbtrb.supabase.co'
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZ3lmaHd0amVsdW11dGNidHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODQ0MDgsImV4cCI6MjA3Nzk2MDQwOH0.RtHKjakCRRuHHvaKWaJOI_dlAv7hZ7Td7-_NdXFOGRM'
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

  constructor() {
    // 1) Prime from current session once (no await in field init)
    this.supabase.auth.getSession().then(({ data }) => {
      this.sessionSig.set(data.session ?? null);
    });

    // 2) Keep it in sync on changes (login/logout/refresh)
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionSig.set(session);
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

