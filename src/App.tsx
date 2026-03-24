import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUserStore } from './store/userStore'
import { getCurrentUser } from './hooks/useSupabase'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'
import Measure from './pages/Measure'
import History from './pages/History'
import Compare from './pages/Compare'
import Subscription from './pages/Subscription'

// Components
import Navbar from './components/Navbar'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  const setUser = useUserStore((state) => state.setUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email })
      }
      setLoading(false)
    })
  }, [setUser])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/measure" element={<ProtectedRoute><Measure /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/measure" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
