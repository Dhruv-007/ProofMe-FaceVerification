# 🎭 ProofMe

<div align="center">

![ProofMe Banner](https://img.shields.io/badge/ProofMe-Face%20Verification-7c3aed?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNOCAxNHMxLjUgMiA0IDIgNC0yIDQtMiIvPjxsaW5lIHgxPSI5IiB5MT0iOSIgeDI9IjkuMDEiIHkyPSI5Ii8+PGxpbmUgeDE9IjE1IiB5MT0iOSIgeDI9IjE1LjAxIiB5Mj0iOSIvPjwvc3ZnPg==)

**Quick face verification to prove you're real ✨**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Face%20Mesh-4285F4?style=flat-square&logo=google)](https://mediapipe.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

[Live Demo](https://proofme.vercel.app) • [Report Bug](https://github.com/yourusername/proofme/issues) • [Request Feature](https://github.com/yourusername/proofme/issues)

</div>

---

## 🌟 Features

- **🎯 Real-time Face Detection** - Powered by MediaPipe Face Mesh with 468 landmark points
- **🔐 5 Liveness Challenges** - Smile, Blink, Turn Left, Turn Right, Open Mouth
- **⚡ Instant Verification** - Complete all challenges in under 30 seconds
- **🎨 Gen-Z UI** - Vibrant purple/cyan/pink color palette with glassmorphism effects
- **📱 Fully Responsive** - Works on desktop and mobile devices
- **🔒 Privacy First** - All processing happens locally, no data leaves your device
- **🌐 Works Offline** - After initial load, works without internet

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td><strong>Home Screen</strong></td>
<td><strong>Verification</strong></td>
<td><strong>Success</strong></td>
</tr>
<tr>
<td>Face guide with instructions</td>
<td>Real-time challenge prompts</td>
<td>Verification complete!</td>
</tr>
</table>
</div>

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- A device with a camera

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/proofme.git

# Navigate to project directory
cd proofme

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Tailwind CSS v4** | Styling |
| **MediaPipe Face Mesh** | Face Detection |
| **Lucide Icons** | Icons |

## 📁 Project Structure

```
proofme/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── progress.tsx
│   │   └── LivenessVerification.tsx  # Main component
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Tailwind + custom styles
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🎮 How It Works

1. **Position Your Face** - Align your face within the oval guide
2. **Follow Prompts** - Complete each challenge as instructed
3. **Hold Steady** - Hold each pose for ~1 second
4. **Get Verified** - Complete all 5 challenges to verify

### Challenges

| Challenge | Emoji | Detection Method |
|-----------|-------|------------------|
| Smile | 😊 | Mouth width/height ratio |
| Blink | 😉 | Eye aspect ratio |
| Turn Left | 👈 | Nose position offset |
| Turn Right | 👉 | Nose position offset |
| Open Mouth | 😮 | Lip distance |

## 🎨 Color Palette

```css
/* Gen-Z Vibrant Colors */
--primary: hsl(270, 95%, 65%);      /* Electric Purple */
--secondary: hsl(175, 95%, 50%);    /* Neon Cyan */
--accent: hsl(330, 95%, 60%);       /* Hot Pink */
--success: hsl(150, 100%, 50%);     /* Neon Green */
--background: hsl(270, 50%, 3%);    /* Deep Purple-Black */
```

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to [Vercel](https://vercel.com) for automatic deployments.

## ⚠️ Important Notes

- **HTTPS Required** - Camera access requires HTTPS (localhost is exempt)
- **Browser Support** - Works best on Chrome, Firefox, Safari, Edge
- **Permissions** - Users must grant camera permission
- **Lighting** - Good lighting improves detection accuracy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) - For the amazing face detection models
- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful UI components
- [Lucide](https://lucide.dev/) - For the icons
- [Tailwind CSS](https://tailwindcss.com/) - For the styling system

---

<div align="center">

**Made with 💜 by [Your Name]**

⭐ Star this repo if you found it helpful!

</div>
