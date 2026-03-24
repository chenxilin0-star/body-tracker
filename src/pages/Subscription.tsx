import { Crown, Star, CheckCircle, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '../store/userStore'
import { useNavigate } from 'react-router-dom'

export default function Subscription() {
  const { t } = useTranslation()
  const { isPro, user } = useUserStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 py-8 px-4">
      {/* Decorative */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-teal-400 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full opacity-10 blur-3xl" />

      <div className="relative max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-indigo-200 mb-3">
            <Star className="w-3 h-3" /> {t('subscription.limitedTime')}
          </div>
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-400/20 rounded-2xl backdrop-blur-sm">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{t('subscription.title')}</h1>
          </div>
          <p className="text-indigo-200 text-sm">{t('subscription.subtitle')}</p>
        </div>

        {/* Current status badge */}
        <div className="flex justify-center mb-6">
          {isPro ? (
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span className="text-sm font-medium text-green-200">
                {user?.email} — {t('subscription.proActive')}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-indigo-300" />
              <span className="text-sm font-medium text-indigo-200">
                {t('subscription.freePlan')}
              </span>
            </div>
          )}
        </div>

        {/* Pricing card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Price header */}
          <div className="bg-gradient-to-r from-indigo-600 to-teal-500 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-5xl font-bold text-white">$4.99</span>
              <div className="text-left">
                <p className="text-indigo-200 text-xs">{t('subscription.perMonth')}</p>
                <p className="text-indigo-200 text-[10px] line-through opacity-60">$9.99/mo</p>
              </div>
            </div>
            <p className="text-indigo-100 text-xs">{t('subscription.launchPrice')}</p>
          </div>

          {/* Features */}
          <div className="p-6">
            <div className="space-y-3 mb-6">
              {[
                { icon: '♾️', title: t('subscription.unlimitedMeasurements'), desc: t('subscription.unlimitedMeasurementsDesc') },
                { icon: '📸', title: t('subscription.unlimitedPhotos'), desc: t('subscription.unlimitedPhotosDesc') },
                { icon: '📊', title: t('subscription.advancedComparison'), desc: t('subscription.advancedComparisonDesc') },
                { icon: '📄', title: t('subscription.dataExport'), desc: t('subscription.dataExportDesc') },
                { icon: '🚀', title: t('subscription.prioritySupport'), desc: t('subscription.prioritySupportDesc') },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xl mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {isPro ? (
              <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold py-3.5 rounded-xl">
                <CheckCircle className="w-5 h-5" />
                {t('subscription.alreadyPro')}
              </div>
            ) : (
              <a
                href="https://bodytracker.lemonsqueezy.com/checkout"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center"
              >
                <Crown className="w-4 h-4" />
                {t('subscription.upgradeToPro')}
              </a>
            )}

            <p className="text-center text-xs text-gray-400 mt-3">
              {isPro ? t('subscription.enjoyPro') : t('subscription.currentlyFree')}
            </p>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-6 text-center">
          <p className="text-xs text-indigo-200 mb-2">{t('subscription.joinEarly')}</p>
          <div className="flex items-center justify-center gap-1">
            {['⭐', '⭐', '⭐', '⭐', '⭐'].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <p className="text-xs text-indigo-300 mt-1">{t('subscription.avgRating')}</p>
        </div>

        {/* Back button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/measure')}
            className="text-sm text-indigo-300 hover:text-white transition-colors"
          >
            ← {t('subscription.backToMeasure')}
          </button>
        </div>
      </div>
    </div>
  )
}
