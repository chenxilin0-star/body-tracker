import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { initPoseLandmarker, detectPose } from '../lib/pose'
import { Camera, Upload, CheckCircle, RefreshCw, Save, Zap, Target, ShieldCheck } from 'lucide-react'

export default function Measure() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('Initialize the AI model to start measuring')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [measurements, setMeasurements] = useState<{waist?: number, hip?: number, chest?: number} | null>(null)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [poseInitialized, setPoseInitialized] = useState(false)

  const initModel = async () => {
    setLoading(true)
    setMessage('Loading AI model — this takes a few seconds...')
    try {
      await initPoseLandmarker()
      setPoseInitialized(true)
      setMessage('✅ AI model ready! Upload a photo to measure.')
    } catch {
      setMessage('❌ Failed to load AI model. Please refresh the page.')
    }
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setMessage('🔍 Analyzing your photo...')
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
        setMessage('✅ Measurement complete! Review your results below.')
      } else {
        setMessage('⚠️ Could not detect pose. Please upload a clear full-body front photo.')
      }
    } catch {
      setMessage('❌ Error analyzing photo. Please try again.')
    }
    setLoading(false)
  }

  const saveMeasurement = async () => {
    if (!measurements) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('measurements').insert({
      user_id: user.id,
      photo_front_url: imageUrl,
      waist: measurements.waist,
      hip: measurements.hip,
      chest: measurements.chest,
    })
    if (error) {
      setMessage('❌ Failed to save measurement')
    } else {
      setSaved(true)
      setMessage('✅ Measurement saved! View it in your History.')
    }
  }

  const reset = () => {
    setImageUrl(null)
    setMeasurements(null)
    setSaved(false)
    setMessage('Ready! Upload another photo.')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <Zap className="w-3 h-3" /> AI-Powered Analysis
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Body Measurement</h1>
          <p className="text-sm text-gray-500 mt-1">Upload a front-facing full-body photo</p>
        </div>

        {/* Init / Upload card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          {!poseInitialized ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Initialize AI Model</h3>
              <p className="text-sm text-gray-500 mb-4">Our AI runs locally in your browser — no data is uploaded</p>
              <button
                onClick={initModel}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Loading...</> : <><Zap className="w-4 h-4" /> Initialize AI Model</>}
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
              <p className="font-medium text-gray-700">Click to upload photo</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG — front-facing full body works best</p>
            </div>
          )}
        </div>

        {/* Photo preview */}
        {imageUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-400" /> Your Photo
              </h3>
              <button onClick={reset} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> New photo
              </button>
            </div>
            <img src={imageUrl} alt="Preview" className="w-full rounded-xl shadow" />
          </div>
        )}

        {/* Results */}
        {measurements && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" /> Estimated Measurements
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Waist', value: measurements.waist },
                { label: 'Chest', value: measurements.chest },
                { label: 'Hip', value: measurements.hip },
              ].map(({ label, value }) => (
                <div key={label} className="bg-indigo-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-indigo-700">{value}</p>
                  <p className="text-xs text-indigo-500 font-medium mt-1">{label} (cm)</p>
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
              {saved ? <><CheckCircle className="w-4 h-4" /> Saved to History</> : <><Save className="w-4 h-4" /> Save Measurement</>}
            </button>
          </div>
        )}

        {/* Status message */}
        <div className={`text-center text-sm py-3 px-4 rounded-xl ${
          message.includes('✅') || message.includes('saved') ? 'bg-green-50 text-green-700' :
          message.includes('⚠️') || message.includes('Failed') || message.includes('❌') ? 'bg-red-50 text-red-700' :
          'bg-indigo-50 text-indigo-700'
        }`}>
          {message}
        </div>

        {/* Tips */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { title: 'Good lighting', desc: 'Natural light from the front works best' },
            { title: 'Tight clothing', desc: 'Wear fitted clothes for accurate results' },
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
