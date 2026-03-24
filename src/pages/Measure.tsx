import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { initPoseLandmarker, detectPose } from '../lib/pose'
import { Camera, Upload, CheckCircle, RefreshCw, Save, Zap, Target, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '../store/userStore'
import UpgradeModal from '../components/UpgradeModal'

function isToday(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

async function getTodayMeasurementCount(userId: string): Promise<number> {
  const { data } = await supabase
    .from('measurements')
    .select('created_at')
    .eq('user_id', userId)
  if (!data) return 0
  return data.filter((m) => isToday(m.created_at)).length
}

export default function Measure() {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [measurements, setMeasurements] = useState<{waist?: number, hip?: number, chest?: number} | null>(null)
  const [saved, setSaved] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [poseInitialized, setPoseInitialized] = useState(false)
  const [statusKey, setStatusKey] = useState<'init' | 'loading' | 'ready' | 'failed' | 'analyzing' | 'complete' | 'nopose' | 'error' | 'saveFailed' | 'saved' | 'ready2' | 'limitReached'>('init')
  const { t } = useTranslation()
  const { user, isPro } = useUserStore()

  const statusMessages: Record<string, string> = {
    init: t('measure.statusInitAi'),
    loading: t('measure.statusLoadingAi'),
    ready: t('measure.statusAiReady'),
    failed: t('measure.statusAiFailed'),
    analyzing: t('measure.statusAnalyzing'),
    complete: t('measure.statusComplete'),
    nopose: t('measure.statusNoPose'),
    error: t('measure.statusError'),
    saveFailed: t('measure.statusSaveFailed'),
    saved: t('measure.statusSaved'),
    ready2: t('measure.statusReady'),
    limitReached: t('measure.statusLimitReached'),
  }

  const statusClass = (key: string) => {
    if (['ready', 'complete', 'saved'].includes(key)) return 'bg-green-50 text-green-700'
    if (['failed', 'error', 'saveFailed', 'nopose', 'limitReached'].includes(key)) return 'bg-red-50 text-red-700'
    return 'bg-indigo-50 text-indigo-700'
  }

  const initModel = async () => {
    setLoading(true)
    setStatusKey('loading')
    try {
      await initPoseLandmarker()
      setPoseInitialized(true)
      setStatusKey('ready')
    } catch {
      setStatusKey('failed')
    }
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setStatusKey('analyzing')
    setMeasurements(null)
    setSaved(false)

    try {
      const previewUrl = URL.createObjectURL(file)
      setImageUrl(previewUrl)
      const img = new Image()
      img.src = previewUrl
      await new Promise((resolve) => { img.onload = resolve })
      const result = await detectPose(img)

      if (result.landmarks && result.landmarks.length > 0) {
        const lm = result.landmarks[0]
        const leftShoulder = lm[11]
        const rightShoulder = lm[12]
        const leftHip = lm[23]
        const rightHip = lm[24]
        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x)
        const hipWidth = Math.abs(rightHip.x - leftHip.x)
        const scale = 100
        const waist = Math.round((shoulderWidth + hipWidth) / 2 * scale)
        const chest = Math.round(shoulderWidth * scale * 1.2)
        const hip = Math.round(hipWidth * scale)
        setMeasurements({ waist, chest, hip })
        setStatusKey('complete')
      } else {
        setStatusKey('nopose')
      }
    } catch {
      setStatusKey('error')
    }
    setLoading(false)
  }

  const saveMeasurement = async () => {
    if (!measurements || !user) return

    // Check daily limit for non-Pro users
    if (!isPro) {
      const todayCount = await getTodayMeasurementCount(user.id)
      if (todayCount >= 1) {
        setStatusKey('limitReached')
        setShowUpgradeModal(true)
        return
      }
    }

    const { error } = await supabase.from('measurements').insert({
      user_id: user.id,
      photo_front_url: imageUrl,
      waist: measurements.waist,
      hip: measurements.hip,
      chest: measurements.chest,
    })
    if (error) {
      setStatusKey('saveFailed')
    } else {
      setSaved(true)
      setStatusKey('saved')
    }
  }

  const reset = () => {
    setImageUrl(null)
    setMeasurements(null)
    setSaved(false)
    setStatusKey('ready2')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} reason="daily_limit" />

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <Zap className="w-3 h-3" /> {t('measure.aiPowered')}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('measure.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('measure.uploadHint')}</p>
          {!isPro && (
            <p className="text-xs text-gray-400 mt-1">
              {t('measure.freeDailyLimit')}
            </p>
          )}
        </div>

        {/* Init / Upload card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          {!poseInitialized ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{t('measure.initModel')}</h3>
              <p className="text-sm text-gray-500 mb-4">{t('measure.initModelDesc')}</p>
              <button
                onClick={initModel}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t('measure.loading')}</> : <><Zap className="w-4 h-4" /> {t('measure.initialize')}</>}
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-7 h-7 text-indigo-600" />
              </div>
              <p className="font-medium text-gray-700">{t('measure.clickToUpload')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('measure.uploadHintSmall')}</p>
            </div>
          )}
        </div>

        {/* Photo preview */}
        {imageUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-400" /> {t('measure.yourPhoto')}
              </h3>
              <button onClick={reset} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> {t('measure.newPhoto')}
              </button>
            </div>
            <img src={imageUrl} alt="Preview" className="w-full rounded-xl shadow" />
          </div>
        )}

        {/* Results */}
        {measurements && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" /> {t('measure.estimatedMeasurements')}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t('measure.waist'), value: measurements.waist },
                { label: t('measure.chest'), value: measurements.chest },
                { label: t('measure.hip'), value: measurements.hip },
              ].map(({ label, value }) => (
                <div key={label} className="bg-indigo-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-indigo-700">{value}</p>
                  <p className="text-xs text-indigo-500 font-medium mt-1">{label} ({t('measure.cm')})</p>
                </div>
              ))}
            </div>
            <button
              onClick={saveMeasurement}
              disabled={saved}
              className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] ${
                saved ? 'bg-green-100 text-green-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {saved ? <><CheckCircle className="w-4 h-4" /> {t('measure.savedToHistory')}</> : <><Save className="w-4 h-4" /> {t('measure.saveMeasurement')}</>}
            </button>
          </div>
        )}

        {/* Status message */}
        <div className={`text-center text-sm py-3 px-4 rounded-xl ${statusClass(statusKey)}`}>
          {statusMessages[statusKey]}
        </div>

        {/* Tips */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { title: t('measure.tipsGoodLighting'), desc: t('measure.tipsGoodLightingDesc') },
            { title: t('measure.tipsTightClothing'), desc: t('measure.tipsTightClothingDesc') },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white/60 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-700">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
