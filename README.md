# Will You Be My Friend? 💙

A fullscreen, interactive 3D "friendship proposal" built with **React (Vite)**,
**Three.js**, **@react-three/fiber**, and **@react-three/drei**.

## ✨ What's inside

- Fullscreen animated 3D scene: starry night sky, glowing sparkle dust,
  fireflies, drifting clouds, and a big glowing floating heart.
- Cinematic camera: slow autonomous drift + a gentle parallax nudge from
  your mouse position.
- Soft blue / purple / pink point-light rig with bloom + vignette
  post-processing (`@react-three/postprocessing`).
- A glassmorphism proposal card in the center with:
  - **💙 Yes, I'd Love To!** → triggers a confetti + flying-heart
    celebration (`react-confetti` + `framer-motion`), the 3D heart pulses
    faster and glows brighter, and the card flips to a thank-you message.
  - **🤭 Maybe...** → the button runs away to a random spot on screen every
    time you hover/click it, popping up a different funny message each
    time. After 8 attempts it disappears, leaving only "Yes".
- Optional background music toggle (top-right button).
- Fully responsive, down to small phones.

## 📁 Project structure

```
src/
 ├── components/
 │     Scene.jsx          # Canvas, camera rig, lighting, composition, bloom
 │     FloatingHeart.jsx  # Center 3D heart + celebratory heart burst
 │     Stars.jsx          # Starfield + colorful floating 3D stars
 │     ProposalCard.jsx   # Glassmorphism UI card + Yes/Maybe interactions
 │     ConfettiEffect.jsx # react-confetti + flying emoji-heart overlay
 │     Sparkles.jsx       # Ambient sparkle dust + fireflies
 ├── App.jsx              # Wires scene + UI + confetti + music toggle together
 └── App.css              # All styling: glass card, buttons, responsive rules
```

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## 🎵 Background music

The music button in the top-right corner plays the audio of a specific
YouTube video (currently id `qVHaXD7zHDQ`, set in `MUSIC_VIDEO_ID` at the
top of `src/App.jsx`) through YouTube's official IFrame Player API. The
player is mounted at 1x1px and hidden — only the on-screen button
controls it, no YouTube UI is ever shown.

Notes:

- This requires an internet connection at runtime (it loads
  `https://www.youtube.com/iframe_api`).
- It only works if the video owner has allowed embedding. If embedding is
  disabled for a given video, the button stays disabled/no-ops.
- To use a different track, swap `MUSIC_VIDEO_ID` in `src/App.jsx` for
  another YouTube video id.

## 🛠️ Notes

- All 3D geometry (the heart, the little 3D stars) is generated
  procedurally with `THREE.Shape` + `ExtrudeGeometry` — no external model
  files needed.
- Reduced-motion users get the pulsing animations disabled automatically
  (`prefers-reduced-motion`).
- Tune the palette in `src/App.css` (`:root` custom properties) and the
  light colors in `src/components/Scene.jsx` (`MagicLighting`) if you'd
  like a different mood.
