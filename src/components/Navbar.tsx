import { Link } from 'react-router-dom'
import { useUserStore } from '../store/userStore'
import { signOut } from '../hooks/useSupabase'
import { useNavigate } from 'react-router-dom'
import { Activity, Ruler, History, BarChart3, Crown, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { to: '/measure', label: 'Measure', icon: Ruler },
  { to: '/history', label: 'History', icon: History },
  { to: '/compare', label: 'Compare', icon: BarChart3 },
  { to: '/subscription', label: 'Pro', icon: Crown },
]

export default function Navbar() {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/measure" className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Body Tracker</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all ml-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 text-gray-500 hover:text-indigo-600"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="sm:hidden py-3 border-t border-gray-100 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
