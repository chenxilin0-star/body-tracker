import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../hooks/useSupabase'
import { useUserStore } from '../store/userStore'
import { Activity, Mail, Lock, CheckCircle2 } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    const { data, error } = await signUp(email, password)
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email })
      navigate('/measure')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-indigo-600 to-indigo-800 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-64 h-64 bg-teal-400 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-400 rounded-full opacity-10 blur-3xl" />
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Body Tracker</h1>
            </div>
            <p className="text-indigo-200 text-sm">Start tracking your body composition today</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Create your account</h2>
            <p className="text-sm text-gray-500 mb-6">Free forever, no credit card required</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? <span className="animate-pulse">Creating account...</span> : <><CheckCircle2 className="w-4 h-4" /> Create Account</>}
              </button>
            </form>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {['Free forever', 'AI-powered', 'Private & secure'].map((label) => (
                <div key={label} className="text-xs text-gray-500 bg-gray-50 rounded-lg py-2 px-1">{label}</div>
              ))}
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-indigo-200">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:underline underline-offset-2">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
