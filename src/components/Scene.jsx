import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Cloud, Clouds } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

import Stars from './Stars.jsx'
import FloatingHeart, { HeartBurst } from './FloatingHeart.jsx'
import { MagicSparkles, Fireflies } from './Sparkles.jsx'

/**
 * Moves the camera in a slow cinematic drift (a gentle figure-eight-ish
 * orbit) while also letting the mouse position nudge the look direction
 * a little, for a subtle parallax feel. Never fully hands control to the
 * user -- this keeps the "proposal" moment cinematic rather than a free
 * fly-around.
 */
function CameraRig() {
  const { camera, pointer } = useThree()
  const target = useRef(new THREE.Vector3(0, 0.3, 0))

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // slow autonomous cinematic drift
    const driftX = Math.sin(t * 0.12) * 1.4
    const driftY = Math.cos(t * 0.09) * 0.5
    const driftZ = 5.5 + Math.sin(t * 0.07) * 0.6

    // mouse parallax, small and smooth
    const mouseX = pointer.x * 0.6
    const mouseY = pointer.y * 0.3

    const desiredX = driftX + mouseX
    const desiredY = driftY + mouseY + 0.4
    const desiredZ = driftZ

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, desiredX, 0.02)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredY, 0.02)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, 0.02)

    camera.lookAt(target.current)
  })

  return null
}

/** Soft, colorful lighting rig: blue / purple / pink tones, gentle shadows. */
function MagicLighting() {
  return (
    <>
      <ambientLight intensity={0.28} color="#c7d2fe" />
      <pointLight
        position={[-4, 3, 2]}
        intensity={18}
        color="#7dd3fc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[4, 2, -2]} intensity={16} color="#c084fc" />
      <pointLight position={[0, -2, 3]} intensity={9} color="#f9a8d4" />
      <hemisphereLight args={['#a5b4fc', '#1e1b4b', 0.3]} />
    </>
  )
}

/**
 * A cluster of soft, low-poly-ish puffy clouds drifting far behind
 * everything else. Kept small, dim, and tucked into the corners so they
 * read as distant atmosphere rather than a fog bank across the whole sky.
 */
function CuteClouds() {
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud
        seed={1}
        position={[-6, -2, -10]}
        speed={0.1}
        opacity={0.16}
        segments={14}
        bounds={[1.6, 0.6, 0.6]}
        volume={4}
        color="#4c3f91"
      />
      <Cloud
        seed={7}
        position={[6, 2.5, -12]}
        speed={0.08}
        opacity={0.14}
        segments={14}
        bounds={[1.8, 0.7, 0.6]}
        volume={4}
        color="#5b3e8f"
      />
      <Cloud
        seed={13}
        position={[3.5, -3, -11]}
        speed={0.07}
        opacity={0.13}
        segments={12}
        bounds={[1.4, 0.5, 0.5]}
        volume={3}
        color="#31356e"
      />
    </Clouds>
  )
}

/** Everything that lives inside the WebGL canvas. */
function SceneContents({ accepted }) {
  return (
    <>
      <color attach="background" args={['#0b0620']} />
      <fog attach="fog" args={['#0b0620', 8, 22]} />

      <CameraRig />
      <MagicLighting />

      <Stars />
      <CuteClouds />
      <MagicSparkles />
      <Fireflies count={22} />

      <FloatingHeart excited={accepted} />
      {accepted && <HeartBurst count={30} />}

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={accepted ? 0.9 : 0.55}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.7}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </>
  )
}

/**
 * Public entry point: a fullscreen R3F canvas. Kept dumb on purpose --
 * all it needs from the outside world is whether the proposal has been
 * accepted yet, so it can shift into "excited" celebration mode.
 */
export default function Scene({ accepted = false }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.4, 6], fov: 50, near: 0.1, far: 100 }}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}
    >
      <Suspense fallback={null}>
        <SceneContents accepted={accepted} />
      </Suspense>
    </Canvas>
  )
}
