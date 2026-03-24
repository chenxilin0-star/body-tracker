import { X, Crown, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  reason?: 'daily_limit' | 'save_failed'
}

export default function UpgradeModal({ open, onClose, reason = 'daily_limit' }: UpgradeModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!open) return null

  const handleGoPro = () => {
    onClose()
    navigate('/subscription')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          {reason === 'daily_limit' ? t('upgradeModal.dailyLimitTitle') : t('upgradeModal.saveFailedTitle')}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-1">
          {reason === 'daily_limit' ? t('upgradeModal.dailyLimitDesc') : t('upgradeModal.saveFailedDesc')}
        </p>
        <p className="text-xs text-gray-400 text-center mb-6">
          {t('upgradeModal.freeLimitNote')}
        </p>

        {/* Pro benefits */}
        <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl p-4 mb-5">
          <p className="text-xs font-semibold text-indigo-700 mb-2">{t('upgradeModal.proBenefits')}</p>
          <ul className="space-y-1.5">
            {[
              t('upgradeModal.benefitUnlimited'),
              t('upgradeModal.benefitPhotos'),
              t('upgradeModal.benefitExport'),
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-xs text-gray-600">
                <Zap className="w-3 h-3 text-teal-500 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={handleGoPro}
          className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Crown className="w-4 h-4" />
          {t('upgradeModal.goPro')}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 py-1.5 transition-colors"
        >
          {t('upgradeModal.maybeLater')}
        </button>
      </div>
    </div>
  )
}
