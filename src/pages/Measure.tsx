import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { initPoseLandmarker, detectPose } from '../lib/pose'
import { Camera } from 'lucide-react'

export default function Measure() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [measurements, setMeasurements] = useState<{waist?: number, hip?: number, chest?: number} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [poseInitialized, setPoseInitialized] = useState(false)

  const initModel = async () => {
    setLoading(true)
    setMessage('Loading AI model...')
    try {
      await initPoseLandmarker()
      setPoseInitialized(true)
      setMessage('Ready! Upload a photo to measure.')
    } catch (err) {
      setMessage('Failed to load AI model. Please refresh.')
    }
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setMessage('Analyzing photo...')
    setMeasurements(null)

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setImageUrl(previewUrl)

      // Detect pose
      const img = new Image()
      img.src = previewUrl
      await new Promise((resolve) => { img.onload = resolve })

      const result = await detectPose(img)
      
      if (result.landmarks && result.landmarks.length > 0) {
        // Calculate measurements from pose landmarks
        const lm = result.landmarks[0]
        
        // Get key points indices (MediaPipe Pose)
        // 11: left_shoulder, 12: right_shoulder, 23: left_hip, 24: right_hip
        const leftShoulder = lm[11]
        const rightShoulder = lm[12]
        const leftHip = lm[23]
        const rightHip = lm[24]

        // Calculate pixel-based measurements (simplified)
        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x)
        const hipWidth = Math.abs(rightHip.x - leftHip.x)
        
        // Scale to approximate real measurements (this is simplified)
        const scale = 100 // pixels to cm approximation
        const waist = Math.round((shoulderWidth + hipWidth) / 2 * scale)
        const chest = Math.round(shoulderWidth * scale * 1.2)
        const hip = Math.round(hipWidth * scale)

        setMeasurements({ waist, chest, hip })
        setMessage('Measurement complete!')
      } else {
        setMessage('Could not detect pose. Please upload a full-body photo.')
      }
    } catch (err) {
      setMessage('Error analyzing photo. Please try again.')
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
      setMessage('Failed to save measurement')
    } else {
      setMessage('Measurement saved!')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Body Measurement</h1>

      {/* Init button */}
      {!poseInitialized && (
        <button
          onClick={initModel}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition mb-4"
        >
          {loading ? 'Loading AI Model...' : 'Initialize AI Model'}
        </button>
      )}

      {poseInitialized && (
        <>
          {/* Upload area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 cursor-pointer hover:border-indigo-400 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Click to upload a full-body photo</p>
            <p className="text-sm text-gray-400 mt-1">Front view works best</p>
          </div>

          {/* Preview */}
          {imageUrl && (
            <div className="mb-6">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-w-md mx-auto rounded-lg shadow"
              />
            </div>
          )}

          {/* Results */}
          {measurements && (
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Estimated Measurements</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{measurements.waist}</p>
                  <p className="text-sm text-gray-500">Waist (cm)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{measurements.chest}</p>
                  <p className="text-sm text-gray-500">Chest (cm)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{measurements.hip}</p>
                  <p className="text-sm text-gray-500">Hip (cm)</p>
                </div>
              </div>
              <button
                onClick={saveMeasurement}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save Measurement
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-500">
            {message}
          </p>
        </>
      )}
    </div>
  )
}
