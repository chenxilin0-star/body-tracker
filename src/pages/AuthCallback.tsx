import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/userStore'

export default function AuthCallback() {
  const navigate = useNavigate()
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({ id: user.id, email: user.email ?? '' })
        navigate('/measure')
      } else {
        navigate('/login')
      }
    }

    handleOAuthCallback()
  }, [navigate, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </div>
  )
}
