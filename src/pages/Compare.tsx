import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Measurement } from '../types'

export default function Compare() {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)

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
    return <div className="text-center py-8">Loading...</div>
  }

  if (measurements.length < 2) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 mb-4">
          You need at least 2 measurements to compare progress
        </p>
        <a href="/measure" className="text-indigo-600 hover:underline">
          Take a measurement →
        </a>
      </div>
    )
  }

  const first = measurements[0]
  const last = measurements[measurements.length - 1]

  const calcDiff = (a: number | null, b: number | null) => {
    if (!a || !b) return null
    const diff = b - a
    return diff > 0 ? `+${diff}` : `${diff}`
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Progress Comparison</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <p className="text-sm text-gray-500">First</p>
            <p className="text-xs text-gray-400">
              {new Date(first.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Latest</p>
            <p className="text-xs text-gray-400">
              {new Date(last.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Change</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Waist', first: first.waist, last: last.waist },
            { label: 'Chest', first: first.chest, last: last.chest },
            { label: 'Hip', first: first.hip, last: last.hip },
          ].map(({ label, first, last }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="w-16 text-sm font-medium">{label}</span>
              <span className="flex-1 text-center">{first || '-'}</span>
              <span className="flex-1 text-center">{last || '-'}</span>
              <span className={`w-12 text-center font-bold ${
                calcDiff(first, last)?.startsWith('+') ? 'text-red-500' : 'text-green-500'
              }`}>
                {calcDiff(first, last) || '-'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Green = progress (loss/gain depending on your goal)
      </p>
    </div>
  )
}
