import { create } from 'zustand'
import type { Profile } from '../types'

type PartialProfile = Partial<Omit<Profile, 'subscription_status'>> & {
  subscription_status?: 'free' | 'pro'
}

interface UserStore {
  user: Profile | null
  setUser: (user: PartialProfile | null) => void
  isPro: boolean
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isPro: false,
  setUser: (user) =>
    set({
      user: user
        ? {
            id: user.id ?? '',
            email: user.email ?? '',
            created_at: user.created_at ?? new Date().toISOString(),
            subscription_status: user.subscription_status ?? 'free',
          }
        : null,
      isPro: user?.subscription_status === 'pro',
    }),
}))
