import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Measurement } from '../types'
import { CalendarDays, Ruler, TrendingUp, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function History() {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const fetchMeasurements = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setMeasurements(data || [])
      setLoading(false)
    }
    fetchMeasurements()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 font-medium">{t('history.loading')}</div>
      </div>
    )
  }

  if (measurements.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Ruler className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('history.noMeasurements')}</h2>
          <p className="text-sm text-gray-500 mb-4">{t('history.takeFirst')}</p>
          <a href="/measure" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
            {t('history.takeMeasurement')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('history.title')}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{measurements.length} record{measurements.length !== 1 ? 's' : ''}</p>
          </div>
          <a href="/measure" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
            {t('history.newMeasurement')}
          </a>
        </div>

        <div className="space-y-3">
          {measurements.map((m, i) => (
            <div key={m.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                {m.photo_front_url ? (
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <img src={m.photo_front_url} alt="Measurement" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 bg-black/50 rounded-full p-1">
                      <ImageIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Ruler className="w-8 h-8 text-indigo-300" />
                  </div>
                )}

                <div className="flex-1 p-4">
                  <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">
                      {new Date(m.created_at).toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'W', value: m.waist },
                      { label: 'C', value: m.chest },
                      { label: 'H', value: m.hip },
                    ].map(({ label, value }) => (
                      <div key={label} className={`text-center py-1.5 rounded-lg ${i === 0 ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                        <p className={`text-sm font-bold ${i === 0 ? 'text-indigo-600' : 'text-gray-700'}`}>{value ?? '—'}</p>
                        <p className="text-[10px] text-gray-400">{label} ({t('measure.cm')})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <TrendingUp className="w-3 h-3" /> {t('history.keepTracking')}
        </div>
      </div>
    </div>
  )
}
