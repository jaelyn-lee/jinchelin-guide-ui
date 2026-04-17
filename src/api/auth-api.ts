import { supabase } from '../lib/supabase'

export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    }),

  login: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  logout: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),
}
