export type ChallengeType = 'smile' | 'turnLeft' | 'turnRight' | 'lookUp' | 'lookDown' | 'showHand' | 'showFingers';

export interface Challenge {
  type: ChallengeType;
  label: string;
  completed: boolean;
}

export interface DetectionResult {
  faceDetected: boolean;
  smiling: boolean;
  headPose: {
    yaw: number; // left/right rotation
    pitch: number; // up/down rotation
  };
  handsDetected: number;
  fingersUp: number;
}


