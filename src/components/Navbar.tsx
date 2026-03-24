import { Link } from 'react-router-dom'
import { useUserStore } from '../store/userStore'
import { signOut } from '../hooks/useSupabase'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/measure" className="text-xl font-bold text-indigo-600">
          Body Tracker
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/measure" className="text-gray-600 hover:text-indigo-600">Measure</Link>
          <Link to="/history" className="text-gray-600 hover:text-indigo-600">History</Link>
          <Link to="/compare" className="text-gray-600 hover:text-indigo-600">Compare</Link>
          <Link to="/subscription" className="text-gray-600 hover:text-indigo-600">Pro</Link>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-red-500">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
