interface Keypoint {
  x: number;
  y: number;
  z?: number;
}

interface Hand {
  keypoints: Keypoint[];
}

// Detect number of fingers up
export function countFingersUp(hand: Hand): number {
  const keypoints = hand.keypoints;
  
  if (keypoints.length < 21) return 0;
  
  let fingersUp = 0;
  
  // Thumb: Compare tip (4) with IP joint (3)
  const thumbTip = keypoints[4];
  const thumbIP = keypoints[3];
  
  // For thumb, check if tip is farther from wrist than IP joint
  const wrist = keypoints[0];
  const thumbTipDist = Math.sqrt(
    Math.pow(thumbTip.x - wrist.x, 2) + Math.pow(thumbTip.y - wrist.y, 2)
  );
  const thumbIPDist = Math.sqrt(
    Math.pow(thumbIP.x - wrist.x, 2) + Math.pow(thumbIP.y - wrist.y, 2)
  );
  
  if (thumbTipDist > thumbIPDist) {
    fingersUp++;
  }
  
  // Index, Middle, Ring, Pinky fingers
  const fingerTipIndices = [8, 12, 16, 20];
  const fingerPIPIndices = [6, 10, 14, 18];
  
  for (let i = 0; i < fingerTipIndices.length; i++) {
    const tip = keypoints[fingerTipIndices[i]];
    const pip = keypoints[fingerPIPIndices[i]];
    
    // Finger is up if tip Y coordinate is less than PIP Y coordinate (higher on screen)
    if (tip.y < pip.y) {
      fingersUp++;
    }
  }
  
  return fingersUp;
}

