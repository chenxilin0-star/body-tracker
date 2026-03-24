import { supabase } from '../lib/supabase'

export const signInWithPassword = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  return await supabase.auth.getUser()
}
