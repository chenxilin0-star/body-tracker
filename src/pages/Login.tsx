import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signInWithPassword } from '../hooks/useSupabase'
import { useUserStore } from '../store/userStore'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const { data, error } = await signInWithPassword(email, password)
    
    if (error) {
      setError(error.message)
      return
    }
    
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email })
      navigate('/measure')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
