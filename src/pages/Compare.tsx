import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Measurement } from '../types'
import { TrendingDown, TrendingUp, Minus, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Compare() {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchMeasurements = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      setMeasurements(data || [])
      setLoading(false)
    }
    fetchMeasurements()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
        <div className="animate-pulse text-teal-600 font-medium">{t('compare.loading')}</div>
      </div>
    )
  }

  if (measurements.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('compare.needAtLeast2')}</h2>
          <p className="text-sm text-gray-500 mb-4">{t('compare.needAtLeast2Desc')}</p>
          <a href="/measure" className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition text-sm font-medium">
            {t('compare.takeMeasurement')}
          </a>
        </div>
      </div>
    )
  }

  const first = measurements[0]
  const last = measurements[measurements.length - 1]

  const calcDiff = (a: number | null, b: number | null) => {
    if (!a || !b) return null
    const diff = b - a
    return diff
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const metrics = [
    { label: t('compare.waist'), key: 'waist' as const },
    { label: t('compare.chest'), key: 'chest' as const },
    { label: t('compare.hip'), key: 'hip' as const },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <BarChart3 className="w-3 h-3" /> {t('compare.progressAnalysis')}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{t('compare.title')}</h1>
          <p className="text-xs text-gray-500 mt-1">{t('compare.subtitle')}</p>
        </div>

        {/* Timeline header */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-xs text-gray-400 mb-1">{t('compare.first')}</p>
              <p className="text-sm font-semibold text-gray-700">{formatDate(first.created_at)}</p>
            </div>
            <div className="flex items-center gap-1 text-indigo-400">
              <div className="h-px w-8 bg-indigo-200" />
              <BarChart3 className="w-4 h-4" />
              <div className="h-px w-8 bg-indigo-200" />
            </div>
            <div className="text-center flex-1">
              <p className="text-xs text-gray-400 mb-1">{t('compare.latest')}</p>
              <p className="text-sm font-semibold text-gray-700">{formatDate(last.created_at)}</p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">{measurements.length} {t('compare.totalMeasurements')}</p>
        </div>

        {/* Metrics comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-indigo-600" /> {t('compare.bodyMeasurements')}
          </h3>

          <div className="space-y-4">
            {metrics.map(({ label, key }) => {
              const diff = calcDiff(first[key], last[key])
              const firstVal = first[key]
              const lastVal = last[key]
              const isPositive = diff !== null && diff > 0
              const isNegative = diff !== null && diff < 0
              const diffColor = isPositive ? 'text-red-500' : isNegative ? 'text-green-500' : 'text-gray-400'
              const diffBg = isPositive ? 'bg-red-50' : isNegative ? 'bg-green-50' : 'bg-gray-50'
              const DiffIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-14 text-sm font-medium text-gray-600">{label}</span>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">{firstVal ?? '—'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-sm font-semibold text-gray-700">{lastVal ?? '—'}</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    {firstVal && lastVal && (
                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isNegative ? 'bg-green-400' : isPositive ? 'bg-red-400' : 'bg-gray-400'}`}
                          style={{ width: `${Math.min(100, Math.abs(diff!) / Math.max(firstVal, lastVal) * 100 + 20)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl ${diffBg}`}>
                    <DiffIcon className={`w-3.5 h-3.5 ${diffColor}`} />
                    <span className={`text-sm font-bold ${diffColor}`}>
                      {diff !== null ? (diff > 0 ? `+${diff}` : `${diff}`) : '—'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white/60 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">{t('compare.whatColorsMean')}</p>
          <div className="flex gap-4">
            {[
              { icon: TrendingDown, color: 'text-green-500', bg: 'bg-green-50', label: t('compare.decreaseGood') },
              { icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-50', label: t('compare.increase') },
            ].map(({ icon: Icon, color, bg, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`p-1 rounded-lg ${bg}`}>
                  <Icon className={`w-3 h-3 ${color}`} />
                </div>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
