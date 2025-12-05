import { useEffect, useRef, useState, useCallback } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Fingerprint,
  Zap,
} from "lucide-react";

// Challenge definitions
interface Challenge {
  id: string;
  type: "smile" | "blink" | "turnLeft" | "turnRight" | "openMouth";
  label: string;
  emoji: string;
  instruction: string;
  tip: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: "smile",
    type: "smile",
    label: "Smile",
    emoji: "😊",
    instruction: "Show us that smile!",
    tip: "Flash those teeth ✨",
  },
  {
    id: "blink",
    type: "blink",
    label: "Blink",
    emoji: "😉",
    instruction: "Give us a wink!",
    tip: "Close both eyes completely",
  },
  {
    id: "turnLeft",
    type: "turnLeft",
    label: "Left",
    emoji: "👈",
    instruction: "Look to your left",
    tip: "Turn about 30 degrees",
  },
  {
    id: "turnRight",
    type: "turnRight",
    label: "Right",
    emoji: "👉",
    instruction: "Look to your right",
    tip: "Turn about 30 degrees",
  },
  {
    id: "openMouth",
    type: "openMouth",
    label: "Surprise",
    emoji: "😮",
    instruction: "Show us surprised!",
    tip: "Open wide like 'Woah!'",
  },
];

// Detection helper functions
function detectSmile(landmarks: any[]): boolean {
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
  return ratio > 3.5;
}

function detectBlink(landmarks: any[]): boolean {
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];

  if (!leftEyeTop || !leftEyeBottom || !rightEyeTop || !rightEyeBottom)
    return false;

  const leftEyeHeight = Math.abs(leftEyeTop.y - leftEyeBottom.y);
  const rightEyeHeight = Math.abs(rightEyeTop.y - rightEyeBottom.y);

  const avgEyeHeight = (leftEyeHeight + rightEyeHeight) / 2;
  return avgEyeHeight < 0.012;
}

function detectTurnLeft(landmarks: any[]): boolean {
  const noseTip = landmarks[1];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  if (!noseTip || !leftCheek || !rightCheek) return false;

  const faceCenterX = (leftCheek.x + rightCheek.x) / 2;
  const noseOffset = noseTip.x - faceCenterX;

  return noseOffset > 0.04;
}

function detectTurnRight(landmarks: any[]): boolean {
  const noseTip = landmarks[1];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  if (!noseTip || !leftCheek || !rightCheek) return false;

  const faceCenterX = (leftCheek.x + rightCheek.x) / 2;
  const noseOffset = noseTip.x - faceCenterX;

  return noseOffset < -0.04;
}

function detectOpenMouth(landmarks: any[]): boolean {
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];

  if (!upperLip || !lowerLip) return false;

  const mouthHeight = Math.abs(lowerLip.y - upperLip.y);
  return mouthHeight > 0.035;
}

const LivenessVerification = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const holdTimeRef = useRef<number>(0);

  const isVerifyingRef = useRef(false);
  const currentChallengeIndexRef = useRef(0);
  const completedChallengesRef = useRef<string[]>([]);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isAllComplete, setIsAllComplete] = useState(false);

  const currentChallenge = CHALLENGES[currentChallengeIndex];
  const holdThreshold = 25;

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        if (!videoRef.current) return;

        const faceMesh = new FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
          if (!mounted) return;

          const hasFace =
            results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0;
          setFaceDetected(hasFace);

          if (canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const ctx = canvas.getContext("2d");

            if (ctx && video.videoWidth && video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;

              ctx.save();
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(video, 0, 0);
              ctx.restore();

              if (hasFace) {
                const landmarks = results.multiFaceLandmarks[0];

                if (isVerifyingRef.current) {
                  const currentIdx = currentChallengeIndexRef.current;
                  const challenge = CHALLENGES[currentIdx];

                  if (challenge) {
                    let actionDetected = false;

                    switch (challenge.type) {
                      case "smile":
                        actionDetected = detectSmile(landmarks);
                        break;
                      case "blink":
                        actionDetected = detectBlink(landmarks);
                        break;
                      case "turnLeft":
                        actionDetected = detectTurnLeft(landmarks);
                        break;
                      case "turnRight":
                        actionDetected = detectTurnRight(landmarks);
                        break;
                      case "openMouth":
                        actionDetected = detectOpenMouth(landmarks);
                        break;
                    }

                    if (actionDetected) {
                      holdTimeRef.current += 1;
                      setHoldProgress(
                        (holdTimeRef.current / holdThreshold) * 100
                      );

                      if (holdTimeRef.current >= holdThreshold) {
                        const newCompleted = [
                          ...completedChallengesRef.current,
                          challenge.id,
                        ];
                        completedChallengesRef.current = newCompleted;
                        setCompletedChallenges(newCompleted);
                        holdTimeRef.current = 0;
                        setHoldProgress(0);

                        if (currentIdx < CHALLENGES.length - 1) {
                          const nextIdx = currentIdx + 1;
                          currentChallengeIndexRef.current = nextIdx;
                          setCurrentChallengeIndex(nextIdx);
                        } else {
                          setIsAllComplete(true);
                          isVerifyingRef.current = false;
                          setIsVerifying(false);
                        }
                      }
                    } else {
                      holdTimeRef.current = Math.max(
                        0,
                        holdTimeRef.current - 2
                      );
                      setHoldProgress(
                        (holdTimeRef.current / holdThreshold) * 100
                      );
                    }
                  }
                }

                // Draw face mesh with gradient colors
                ctx.save();
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                landmarks.forEach((point: any, i: number) => {
                  ctx.beginPath();
                  ctx.arc(
                    point.x * canvas.width,
                    point.y * canvas.height,
                    1.5,
                    0,
                    Math.PI * 2
                  );
                  // Gradient effect on mesh points
                  const hue = (i / landmarks.length) * 60 + 150; // Cyan to green
                  ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
                  ctx.fill();
                });
                ctx.restore();
              }
            }
          }
        });

        faceMeshRef.current = faceMesh;

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMeshRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
          facingMode: "user",
        });

        cameraRef.current = camera;
        await camera.start();

        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Initialization error:", err);
        if (mounted) {
          setError(err.message || "Failed to initialize camera");
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      cameraRef.current?.stop();
    };
  }, []);

  const handleStartVerification = useCallback(() => {
    isVerifyingRef.current = true;
    currentChallengeIndexRef.current = 0;
    completedChallengesRef.current = [];
    holdTimeRef.current = 0;

    setIsVerifying(true);
    setCurrentChallengeIndex(0);
    setCompletedChallenges([]);
    setIsAllComplete(false);
    setHoldProgress(0);
  }, []);

  const handleReset = useCallback(() => {
    isVerifyingRef.current = false;
    currentChallengeIndexRef.current = 0;
    completedChallengesRef.current = [];
    holdTimeRef.current = 0;

    setIsVerifying(false);
    setCurrentChallengeIndex(0);
    setCompletedChallenges([]);
    setIsAllComplete(false);
    setHoldProgress(0);
  }, []);

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full glow-primary">
            <Fingerprint className="w-5 h-5 text-[hsl(270,95%,65%)]" />
            <span className="text-sm font-semibold text-[hsl(270,95%,75%)]">
              Identity Verification
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gradient tracking-tight">
            ProofMe
          </h1>
          <p className="text-[hsl(270,20%,60%)] text-lg">
            Quick face check to prove you're real ✨
          </p>
        </div>

        {/* Main Card */}
        <Card className="overflow-hidden gradient-card border-[hsl(270,30%,15%)] glow-primary">
          <CardContent className="p-5 space-y-5">
            {/* Camera View */}
            <div className="relative aspect-video bg-black/50 rounded-2xl overflow-hidden border border-[hsl(270,30%,20%)]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover hidden"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Face detected badge */}
              {isInitialized && !isLoading && (
                <div className="absolute top-3 right-3">
                  {faceDetected ? (
                    <Badge className="bg-[hsl(150,100%,40%)] text-white border-0 glow-success animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      Face Locked
                    </Badge>
                  ) : (
                    <Badge className="bg-[hsl(270,30%,20%)] text-[hsl(270,20%,60%)] border-[hsl(270,30%,25%)]">
                      Scanning...
                    </Badge>
                  )}
                </div>
              )}

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                  <div className="w-14 h-14 border-4 border-[hsl(270,95%,65%)] border-t-transparent rounded-full animate-spin glow-primary" />
                  <p className="mt-4 text-[hsl(270,20%,70%)] font-medium">
                    Warming up the camera...
                  </p>
                </div>
              )}

              {/* Error overlay */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                  <AlertCircle className="w-14 h-14 text-[hsl(15,95%,60%)]" />
                  <p className="mt-4 text-[hsl(15,95%,70%)] font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Face guide */}
              {isInitialized && !isLoading && (
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 rounded-full border-[3px] transition-all duration-500 ${
                    faceDetected
                      ? "border-[hsl(150,100%,50%)] glow-success border-solid"
                      : "border-[hsl(270,30%,30%)] border-dashed animate-border-dance"
                  }`}
                />
              )}

              {/* No face warning */}
              {isVerifying && !faceDetected && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[hsl(25,100%,50%)] rounded-xl glow-accent">
                  <p className="text-sm font-bold text-white">
                    👀 Get in the frame!
                  </p>
                </div>
              )}

              {/* Hold progress indicator */}
              {isVerifying && faceDetected && holdProgress > 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40">
                  <div className="h-2 bg-[hsl(270,30%,15%)] rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary transition-all duration-100"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-xs text-[hsl(270,95%,75%)] mt-2 font-semibold">
                    Hold it! 🔥
                  </p>
                </div>
              )}
            </div>

            {/* Challenge Instructions */}
            {isVerifying && currentChallenge && !isAllComplete && (
              <div className="p-6 glass rounded-2xl border border-[hsl(270,95%,65%,0.3)] glow-primary">
                <div className="text-center space-y-3">
                  <div className="text-6xl animate-bounce-gentle">
                    {currentChallenge.emoji}
                  </div>
                  <h3 className="text-2xl font-black text-gradient">
                    {currentChallenge.instruction}
                  </h3>
                  <p className="text-sm text-[hsl(270,20%,60%)]">
                    {currentChallenge.tip}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {isAllComplete && (
              <div className="p-6 glass rounded-2xl border border-[hsl(150,100%,50%,0.3)] glow-success">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto gradient-success rounded-full flex items-center justify-center glow-success">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-[hsl(150,100%,60%)]">
                    You're Verified! 🎉
                  </h3>
                  <p className="text-[hsl(270,20%,60%)]">
                    100% real human confirmed
                  </p>
                </div>
              </div>
            )}

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[hsl(270,20%,50%)] font-medium">
                  Progress
                </span>
                <span className="text-[hsl(270,95%,75%)] font-bold">
                  {completedChallenges.length} / {CHALLENGES.length}
                </span>
              </div>
              <div className="h-3 bg-[hsl(270,30%,12%)] rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary transition-all duration-500"
                  style={{
                    width: `${
                      (completedChallenges.length / CHALLENGES.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Challenge Steps */}
            <div className="grid grid-cols-5 gap-2">
              {CHALLENGES.map((challenge, idx) => {
                const isCompleted = completedChallenges.includes(challenge.id);
                const isCurrent = currentChallengeIndex === idx && isVerifying;

                return (
                  <div
                    key={challenge.id}
                    className={`relative p-3 rounded-xl text-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-[hsl(150,100%,50%,0.15)] border border-[hsl(150,100%,50%,0.5)] glow-success"
                        : isCurrent
                        ? "bg-[hsl(270,95%,65%,0.15)] border border-[hsl(270,95%,65%,0.5)] glow-primary animate-glow-pulse"
                        : "bg-[hsl(270,30%,10%)] border border-[hsl(270,30%,18%)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{challenge.emoji}</div>
                    <div
                      className={`text-[10px] font-semibold truncate ${
                        isCompleted
                          ? "text-[hsl(150,100%,60%)]"
                          : isCurrent
                          ? "text-[hsl(270,95%,75%)]"
                          : "text-[hsl(270,20%,50%)]"
                      }`}
                    >
                      {challenge.label}
                    </div>
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 gradient-success rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {isCurrent && !isCompleted && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 gradient-primary rounded-full flex items-center justify-center animate-pulse">
                        <Circle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {!isVerifying && !isAllComplete && (
                <Button
                  onClick={handleStartVerification}
                  disabled={!isInitialized || isLoading}
                  className="flex-1 h-14 text-lg font-bold gradient-primary hover:opacity-90 transition-opacity glow-primary border-0"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Let's Go!
                </Button>
              )}

              {(isVerifying || isAllComplete) && (
                <Button
                  onClick={handleReset}
                  className="flex-1 h-14 text-lg font-bold bg-[hsl(270,30%,15%)] hover:bg-[hsl(270,30%,20%)] text-[hsl(270,20%,70%)] border border-[hsl(270,30%,25%)]"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  {isAllComplete ? "Go Again" : "Reset"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        {!isVerifying && !isAllComplete && (
          <Card className="gradient-card border-[hsl(270,30%,15%)]">
            <CardContent className="p-6">
              <h3 className="font-bold text-[hsl(270,95%,75%)] mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[hsl(175,95%,50%)]" />
                How it works
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "1", text: "Position your face in the oval" },
                  { num: "2", text: "Follow the emoji prompts" },
                  { num: "3", text: "Hold each pose for 1 sec" },
                  { num: "4", text: "Complete all 5 to verify!" },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex items-center gap-3 p-3 bg-[hsl(270,30%,8%)] rounded-xl"
                  >
                    <span className="flex-shrink-0 w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-black">
                      {item.num}
                    </span>
                    <span className="text-sm text-[hsl(270,20%,60%)]">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-[hsl(270,20%,40%)]">
          Powered by AI • Your face data never leaves your device 🔒
        </p>
      </div>
    </div>
  );
};

export default LivenessVerification;
