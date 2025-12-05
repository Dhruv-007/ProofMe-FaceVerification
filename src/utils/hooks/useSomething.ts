// Custom hook for liveness verification challenges

import { useState, useCallback, useRef } from 'react';

interface ChallengeData {
  type: string;
  label: string;
  instruction: string;
}

const CHALLENGES: ChallengeData[] = [
  { type: 'smile', label: '😊 Smile', instruction: 'Please smile at the camera' },
  { type: 'blink', label: '👁️ Blink', instruction: 'Please blink your eyes' },
  { type: 'turnLeft', label: '⬅️ Turn Left', instruction: 'Turn your head to the left' },
  { type: 'turnRight', label: '➡️ Turn Right', instruction: 'Turn your head to the right' },
  { type: 'openMouth', label: '😮 Open Mouth', instruction: 'Open your mouth wide' },
];

/**
 * Custom hook for managing liveness verification challenges
 * @param onChallengeComplete Callback when a challenge is completed
 */
export const useSomething = (onChallengeComplete?: (index: number, name: string) => void) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  
  const holdTimeRef = useRef<number>(0);
  const holdThreshold = 30; // Hold for 30 frames (~1 second)

  /**
   * Start the verification process
   */
  const handleStartVerification = useCallback(() => {
    setIsVerifying(true);
    setCompletedChallenges([]);
    setCurrentChallengeIndex(0);
    holdTimeRef.current = 0;
  }, []);

  /**
   * Stop the verification process
   */
  const handleStopVerification = useCallback(() => {
    setIsVerifying(false);
    holdTimeRef.current = 0;
  }, []);

  /**
   * Check if all challenges are verified
   */
  const isAllVerified = completedChallenges.length === CHALLENGES.length;

  /**
   * Detect liveness actions based on face landmarks
   * @param landmarks Face landmarks from MediaPipe
   */
  const detectLivenessActions = useCallback((landmarks: any[]) => {
    if (!isVerifying || !landmarks || landmarks.length === 0) return;

    const currentChallenge = CHALLENGES[currentChallengeIndex];
    if (!currentChallenge) return;

    // Check if challenge is already completed
    if (completedChallenges.includes(currentChallengeIndex)) {
      return;
    }

    let actionDetected = false;

    // Detect different actions based on challenge type
    switch (currentChallenge.type) {
      case 'smile':
        actionDetected = detectSmile(landmarks);
        break;
      case 'blink':
        actionDetected = detectBlink(landmarks);
        break;
      case 'turnLeft':
        actionDetected = detectTurnLeft(landmarks);
        break;
      case 'turnRight':
        actionDetected = detectTurnRight(landmarks);
        break;
      case 'openMouth':
        actionDetected = detectOpenMouth(landmarks);
        break;
      default:
        actionDetected = false;
    }

    if (actionDetected) {
      holdTimeRef.current += 1;

      // If action held for threshold, mark as complete
      if (holdTimeRef.current >= holdThreshold) {
        setCompletedChallenges((prev) => [...prev, currentChallengeIndex]);
        
        // Trigger callback if provided
        if (onChallengeComplete) {
          onChallengeComplete(currentChallengeIndex, currentChallenge.label);
        }

        // Move to next challenge
        if (currentChallengeIndex < CHALLENGES.length - 1) {
          setCurrentChallengeIndex((prev) => prev + 1);
        }

        holdTimeRef.current = 0;
      }
    } else {
      holdTimeRef.current = 0;
    }
  }, [isVerifying, currentChallengeIndex, completedChallenges, onChallengeComplete]);

  return {
    isVerifying,
    completedChallenges,
    currentChallenge: CHALLENGES[currentChallengeIndex],
    handleStartVerification,
    handleStopVerification,
    detectLivenessActions,
    isAllVerified,
    totalChallenges: CHALLENGES.length,
  };
};

// Helper functions for detecting different actions

function detectSmile(landmarks: any[]): boolean {
  // Mouth corners: left (61), right (291)
  // Lips: upper (13), lower (14)
  const leftCorner = landmarks[61];
  const rightCorner = landmarks[291];
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];

  if (!leftCorner || !rightCorner || !upperLip || !lowerLip) return false;

  const mouthWidth = Math.hypot(
    rightCorner.x - leftCorner.x,
    rightCorner.y - leftCorner.y
  );
  const mouthHeight = Math.hypot(
    lowerLip.x - upperLip.x,
    lowerLip.y - upperLip.y
  );

  const ratio = mouthWidth / mouthHeight;
  return ratio > 3.5; // Smile threshold
}

function detectBlink(landmarks: any[]): boolean {
  // Eye landmarks for detecting blink
  // Left eye: top (159), bottom (145)
  // Right eye: top (386), bottom (374)
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];

  if (!leftEyeTop || !leftEyeBottom || !rightEyeTop || !rightEyeBottom) return false;

  const leftEyeHeight = Math.abs(leftEyeTop.y - leftEyeBottom.y);
  const rightEyeHeight = Math.abs(rightEyeTop.y - rightEyeBottom.y);

  const avgEyeHeight = (leftEyeHeight + rightEyeHeight) / 2;

  // Blink detected when eye height is very small
  return avgEyeHeight < 0.01;
}

function detectTurnLeft(landmarks: any[]): boolean {
  // Nose tip (1) and face center points
  const noseTip = landmarks[1];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  if (!noseTip || !leftCheek || !rightCheek) return false;

  const faceCenterX = (leftCheek.x + rightCheek.x) / 2;
  const noseOffset = noseTip.x - faceCenterX;

  // Turned left when nose is significantly to the left of center
  return noseOffset < -0.05;
}

function detectTurnRight(landmarks: any[]): boolean {
  // Nose tip (1) and face center points
  const noseTip = landmarks[1];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  if (!noseTip || !leftCheek || !rightCheek) return false;

  const faceCenterX = (leftCheek.x + rightCheek.x) / 2;
  const noseOffset = noseTip.x - faceCenterX;

  // Turned right when nose is significantly to the right of center
  return noseOffset > 0.05;
}

function detectOpenMouth(landmarks: any[]): boolean {
  // Upper lip (13), lower lip (14)
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];

  if (!upperLip || !lowerLip) return false;

  const mouthHeight = Math.abs(lowerLip.y - upperLip.y);

  // Open mouth detected when height exceeds threshold
  return mouthHeight > 0.03;
}

