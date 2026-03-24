export interface User {
  id: string
  email?: string
}

export interface Profile {
  id: string
  email: string
  created_at: string
  subscription_status: 'free' | 'pro'
}

export interface Measurement {
  id: string
  user_id: string
  photo_front_url: string | null
  photo_side_url: string | null
  waist: number | null
  hip: number | null
  chest: number | null
  arm: number | null
  thigh: number | null
  created_at: string
}
