// Calculate Euclidean distance between two points
function distance(point1: [number, number], point2: [number, number]): number {
  return Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
}

interface Keypoint {
  x: number;
  y: number;
  z?: number;
}

// Detect smile based on mouth landmarks
export function detectSmile(keypoints: Keypoint[]): boolean {
  // Mouth corner landmarks
  const leftMouthCorner = keypoints[61]; // Left corner
  const rightMouthCorner = keypoints[291]; // Right corner
  const upperLip = keypoints[13]; // Upper lip center
  const lowerLip = keypoints[14]; // Lower lip center
  
  if (!leftMouthCorner || !rightMouthCorner || !upperLip || !lowerLip) {
    return false;
  }
  
  const mouthWidth = distance(
    [leftMouthCorner.x, leftMouthCorner.y],
    [rightMouthCorner.x, rightMouthCorner.y]
  );
  
  const mouthHeight = distance(
    [upperLip.x, upperLip.y],
    [lowerLip.x, lowerLip.y]
  );
  
  const smileRatio = mouthWidth / mouthHeight;
  
  // Typically, when smiling, the mouth width to height ratio increases
  return smileRatio > 3.5;
}

// Calculate head pose (yaw and pitch) from face landmarks
export function calculateHeadPose(keypoints: Keypoint[]): { yaw: number; pitch: number } {
  // Use nose, left eye, and right eye to estimate head pose
  const noseTip = keypoints[1];
  const leftEye = keypoints[33];
  const rightEye = keypoints[263];
  const chin = keypoints[152];
  const forehead = keypoints[10];
  
  if (!noseTip || !leftEye || !rightEye || !chin || !forehead) {
    return { yaw: 0, pitch: 0 };
  }
  
  // Calculate yaw (left-right rotation)
  const eyeCenter = {
    x: (leftEye.x + rightEye.x) / 2,
    y: (leftEye.y + rightEye.y) / 2,
  };
  
  const eyeWidth = distance([leftEye.x, leftEye.y], [rightEye.x, rightEye.y]);
  const noseToEyeCenterX = noseTip.x - eyeCenter.x;
  
  // Normalize by eye width to get relative position
  const yaw = (noseToEyeCenterX / eyeWidth) * 90; // Approximate angle in degrees
  
  // Calculate pitch (up-down rotation)
  const faceHeight = distance([forehead.x, forehead.y], [chin.x, chin.y]);
  const noseToEyeCenterY = noseTip.y - eyeCenter.y;
  
  const pitch = (noseToEyeCenterY / faceHeight) * 90; // Approximate angle in degrees
  
  return { yaw, pitch };
}

