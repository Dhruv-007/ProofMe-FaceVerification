# Camera Debugging Steps

## Check Browser Console

Open the browser console (F12) and look for these messages:

1. "🎥 Initializing MediaPipe..."
2. "📹 Video element:" (should show the element)
3. "Initializing FaceMesh..."
4. "Loading FaceMesh file:" (should show files being loaded)
5. "✅ FaceMesh initialized"
6. "Initializing Hands..."
7. "✅ Hands initialized"
8. "Initializing Camera..."
9. "Starting camera..."
10. "✅ MediaPipe initialized successfully"

## If you see errors:

### Error: "Video element not found"
- The video element isn't mounted yet
- Should be fixed now

### Error: "Failed to load model"
- CDN issue or network problem
- Try refreshing

### Error: "Permission denied" or "NotAllowedError"
- Camera permissions not granted
- Go to browser settings and allow camera

### No errors but camera doesn't start:
- MediaPipe Camera might have an issue
- We'll switch to manual getUserMedia

## Quick Test

Open this URL to test if camera works at all:
http://localhost:5174/src/test-camera.html

If that works, then the issue is with MediaPipe Camera utility.


