import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles as DreiSparkles } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Layered sparkle dust spread through the whole scene. Multiple layers
 * with different sizes/speeds/colors read as richer than one big field.
 */
export function MagicSparkles() {
  return (
    <group>
      <DreiSparkles
        count={220}
        scale={[16, 9, 10]}
        size={2.2}
        speed={0.35}
        color="#c4b5fd"
        opacity={0.8}
      />
      <DreiSparkles
        count={120}
        scale={[12, 7, 8]}
        size={4}
        speed={0.5}
        color="#93c5fd"
        opacity={0.6}
      />
      <DreiSparkles
        count={80}
        scale={[10, 5, 6]}
        size={5.5}
        speed={0.25}
        color="#f9a8d4"
        opacity={0.5}
      />
    </group>
  )
}

/**
 * Soft glowing fireflies that drift on lazy independent loops, giving
 * the lower half of the scene some warm, organic motion.
 */
export function Fireflies({ count = 24 }) {
  const pointsRef = useRef()

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Array(count).fill(0).map(() => ({
      radius: 2 + Math.random() * 5,
      speed: 0.15 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      heightBase: -1.5 + Math.random() * 3,
      heightAmp: 0.4 + Math.random() * 0.8,
    }))
    return { positions, seeds }
  }, [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const arr = pointsRef.current?.geometry?.attributes?.position
    if (!arr) return

    for (let i = 0; i < count; i++) {
      const s = seeds[i]
      const angle = t * s.speed + s.offset
      const x = Math.cos(angle) * s.radius
      const z = Math.sin(angle) * s.radius * 0.7 - 3
      const y = s.heightBase + Math.sin(t * s.speed * 2 + s.offset) * s.heightAmp

      arr.array[i * 3] = x
      arr.array[i * 3 + 1] = y
      arr.array[i * 3 + 2] = z
    }
    arr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#ffe9a8"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default MagicSparkles
