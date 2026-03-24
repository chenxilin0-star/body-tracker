import { Link } from 'react-router-dom'
import { useUserStore } from '../store/userStore'
import { signOut } from '../hooks/useSupabase'
import { useNavigate } from 'react-router-dom'
import { Activity, Ruler, History, BarChart3, Crown, LogOut, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const navLinks = [
  { to: '/measure', labelKey: 'nav.measure', icon: Ruler },
  { to: '/history', labelKey: 'nav.history', icon: History },
  { to: '/compare', labelKey: 'nav.compare', icon: BarChart3 },
  { to: '/subscription', labelKey: 'nav.pro', icon: Crown },
]

export default function Navbar() {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(next)
  }

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
            <span className="text-lg font-bold text-gray-900 tracking-tight">{t('brand.bodyTracker')}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, labelKey, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
                {t(labelKey)}
              </Link>
            ))}

            {/* Language switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all ml-1"
              title="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('nav.signOut')}
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
            {navLinks.map(({ to, labelKey, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Icon className="w-4 h-4" />
                {t(labelKey)}
              </Link>
            ))}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all w-full"
            >
              <Globe className="w-4 h-4" />
              {i18n.language === 'zh' ? 'English' : '中文'}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.signOut')}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
