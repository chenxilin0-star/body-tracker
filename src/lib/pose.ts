import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

let poseLandmarker: PoseLandmarker | null = null

export const initPoseLandmarker = async () => {
  if (poseLandmarker) return poseLandmarker
  
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  )
  
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
      delegate: 'GPU'
    },
    runningMode: 'IMAGE',
    numPoses: 1
  })
  
  return poseLandmarker
}

export const detectPose = async (imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
  if (!poseLandmarker) {
    await initPoseLandmarker()
  }
  
  return poseLandmarker!.detect(imageElement)
}
