import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Measurement } from '../types'

export default function History() {
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
        .order('created_at', { ascending: false })

      setMeasurements(data || [])
      setLoading(false)
    }

    fetchMeasurements()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (measurements.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 mb-4">No measurements yet</p>
        <a href="/measure" className="text-indigo-600 hover:underline">
          Take your first measurement →
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Measurement History</h1>

      <div className="space-y-4">
        {measurements.map((m) => (
          <div key={m.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            {m.photo_front_url && (
              <img
                src={m.photo_front_url}
                alt="Measurement"
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                {new Date(m.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <div className="flex gap-4 mt-1">
                {m.waist && <span className="text-sm">W: {m.waist}cm</span>}
                {m.chest && <span className="text-sm">C: {m.chest}cm</span>}
                {m.hip && <span className="text-sm">H: {m.hip}cm</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
