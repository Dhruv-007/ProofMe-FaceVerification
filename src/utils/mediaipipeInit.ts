// MediaPipe model initialization utility

import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import { FaceMesh } from '@mediapipe/face_mesh';

/**
 * Initialize MediaPipe models
 * Returns initialized segmentation and faceMesh instances
 */
export async function initializeMediaPipeModels() {
  console.log('🎥 Initializing MediaPipe models...');

  // Initialize Selfie Segmentation for background blur
  const segmentation = new SelfieSegmentation({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
    },
  });

  segmentation.setOptions({
    modelSelection: 1, // 0 for general, 1 for landscape (better quality)
    selfieMode: false,
  });

  console.log('✅ Selfie Segmentation initialized');

  // Initialize FaceMesh for face landmark detection
  const faceMesh = new FaceMesh({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  console.log('✅ FaceMesh initialized');

  return {
    segmentation,
    faceMesh,
  };
}

