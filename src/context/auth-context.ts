import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export interface AuthContextType {
  session: Session | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
})