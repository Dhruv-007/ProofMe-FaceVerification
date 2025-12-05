# 🎥 Liveliness Detection Demo Instructions

## Quick Start Guide

### 1. Start the Application
The development server is already running at: **http://localhost:5173/**

Open this URL in your browser (preferably Chrome or Edge for best performance).

### 2. Grant Camera Permissions
When prompted, click **"Allow"** to grant camera access to the application.

### 3. Wait for Model Loading
The application will load the TensorFlow.js models. You'll see a loading spinner with the message "Loading detection models..." This typically takes 3-10 seconds depending on your internet connection.

### 4. Configure Settings
- **Face Mesh Toggle**: Check or uncheck the "Show Face Mesh" option
  - ✅ **Checked**: Shows a green mesh overlay with 468 facial landmarks
  - ⬜ **Unchecked**: Only shows hand tracking (cleaner view)

### 5. Start Detection
Click the **"Start Detection"** button to begin the liveliness verification process.

## 🎯 Completing the Challenges

You'll need to complete 7 challenges in sequence. Each challenge requires you to hold the position for **1 second**.

### Challenge 1: 😊 Smile
- **Action**: Smile naturally showing your teeth
- **Tips**: 
  - Make sure your face is well-lit
  - Look directly at the camera
  - A genuine smile works best (not just stretching lips)

### Challenge 2: ⬅️ Turn Left
- **Action**: Turn your head to the left (your left side)
- **Tips**:
  - Rotate your head about 30-45 degrees
  - Keep your face visible in the frame
  - Don't turn too far or the face detection may lose you

### Challenge 3: ➡️ Turn Right
- **Action**: Turn your head to the right (your right side)
- **Tips**:
  - Similar to turning left
  - Rotate about 30-45 degrees
  - Stay centered in the frame

### Challenge 4: ⬆️ Look Up
- **Action**: Tilt your head upward
- **Tips**:
  - Look toward the ceiling
  - Tilt about 20-30 degrees
  - Keep your face in frame

### Challenge 5: ⬇️ Look Down
- **Action**: Tilt your head downward
- **Tips**:
  - Look toward your chest
  - Tilt about 20-30 degrees
  - Don't go too far down

### Challenge 6: ✋ Show Hand
- **Action**: Raise one hand in front of the camera
- **Tips**:
  - Place your hand between your face and the camera
  - Keep the hand open and visible
  - Red landmarks will appear on your hand when detected

### Challenge 7: 🖐️ Show 5 Fingers
- **Action**: Spread all 5 fingers of one hand
- **Tips**:
  - Open your hand fully with fingers spread
  - Keep palm facing the camera
  - Make sure all fingers are clearly visible
  - The system counts extended fingers

## ✅ Completion

Once all challenges are complete, you'll see a green overlay with:
> **✅ All Challenges Complete!**  
> **Liveliness verified successfully**

Click **"Reset"** to try again or test different conditions.

## 🎨 Visual Indicators

### Face Detected
- Green mesh appears on your face (if enabled)
- Current challenge shows at the top

### No Face Detected
- Red warning overlay appears
- Message: "⚠️ No face detected - Please position your face in the camera"

### Challenge In Progress
- Blue overlay at the top shows current challenge
- When action is correct: "✓ Hold..." message appears

### Challenge Completed
- Card turns green with checkmark
- Automatically advances to next challenge

### Progress Cards
- **White with gray border**: Not started yet
- **Blue border with scaled-up**: Currently active
- **Green with checkmark**: Completed

## 🔧 Troubleshooting

### Face Not Detected
1. **Check lighting**: Ensure your face is well-lit (front lighting is best)
2. **Move closer**: Sit about 2-3 feet from the camera
3. **Center yourself**: Keep your face in the center of the frame
4. **Remove obstructions**: Take off glasses or hats if causing issues

### Hand Not Detected
1. **Better lighting**: Hands need good lighting too
2. **Clear background**: Avoid cluttered backgrounds
3. **Hand position**: Keep hand between face and camera
4. **Single hand**: Show one hand clearly (not overlapping with face)

### Challenges Not Completing
1. **Hold longer**: Make sure to hold the position for full 1 second
2. **More pronounced action**: Make movements more exaggerated
3. **Stay still**: Don't move during the hold period
4. **Check browser console**: Look for any error messages

### Performance Issues
1. **Close other tabs**: Free up browser resources
2. **Disable face mesh**: Uncheck "Show Face Mesh" for better performance
3. **Better hardware**: Use a computer with better GPU
4. **Update browser**: Make sure you're using the latest browser version

## 📊 Technical Details

### Detection Rates
- **Face Detection**: ~30 FPS (frames per second)
- **Hand Detection**: ~30 FPS
- **Combined Detection**: ~25-30 FPS (depends on hardware)

### Model Information
- **Face Model**: MediaPipe FaceMesh (468 landmarks)
- **Hand Model**: MediaPipe Hands (21 landmarks per hand)
- **Backend**: TensorFlow.js WebGL

### Browser Requirements
- **Webcam**: Required
- **JavaScript**: Must be enabled
- **WebGL**: Must be supported
- **Camera Permission**: Must be granted

## 🎓 Use Cases

This liveliness detection system can be used for:
- **Identity Verification**: Ensure user is present during sign-up/login
- **Anti-Spoofing**: Prevent photo/video replay attacks
- **User Engagement**: Interactive experiences requiring user attention
- **Accessibility Testing**: Verify head tracking capabilities
- **Security Applications**: Multi-factor authentication

## 📱 Mobile Support

While the application works on mobile devices:
- **Front camera** will be used automatically
- **Portrait mode** recommended
- **Stable mount** helps with detection accuracy
- **Good lighting** even more critical on mobile

## 🚀 Next Steps

After successfully testing the basic functionality:
1. Try different lighting conditions
2. Test with/without glasses
3. Try from different distances
4. Test on different browsers
5. Experiment with the face mesh visualization

## 💡 Tips for Best Results

1. **Optimal Distance**: 2-3 feet from camera
2. **Lighting**: Front-facing light source (window or lamp)
3. **Background**: Plain, non-busy background
4. **Camera Height**: Camera at eye level
5. **Internet**: Stable connection (for initial model download)

---

Enjoy testing the liveliness detection system! 🎉


