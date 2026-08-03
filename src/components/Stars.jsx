import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars as DreiStars, Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Builds a simple 5-point star Shape that we can extrude into a slim
 * 3D mesh. Kept small + soft so it reads as "cute" rather than sharp.
 */
function createStarShape(outerRadius = 0.3, innerRadius = 0.13, points = 5) {
  const shape = new THREE.Shape()
  const step = Math.PI / points

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = i * step - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

/** A single small glowing 3D star, gently spinning in place. */
function CuteStar({ position, color, scale = 1, speed = 1 }) {
  const meshRef = useRef()
  const geometry = useMemo(() => {
    const shape = createStarShape()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    })
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.3 * speed
      meshRef.current.rotation.y += delta * 0.15 * speed
    }
  })

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale} geometry={geometry} castShadow>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  )
}

/**
 * Full starry-night dressing for the scene:
 *  - a dense drei <Stars> field for the distant background
 *  - a handful of larger, colorful "cute" star meshes floating closer
 *    to the camera so the scene feels dimensional, not flat.
 */
export default function Stars() {
  const cuteStars = useMemo(() => {
    const palette = ['#a5b4fc', '#f0abfc', '#93c5fd', '#fbcfe8']
    const items = []
    for (let i = 0; i < 14; i++) {
      items.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 10 + 2,
          (Math.random() - 0.5) * 10 - 4,
        ],
        color: palette[i % palette.length],
        scale: 0.5 + Math.random() * 0.7,
        speed: 0.6 + Math.random() * 0.8,
      })
    }
    return items
  }, [])

  return (
    <group>
      {/* Distant twinkling star field */}
      <DreiStars
        radius={60}
        depth={40}
        count={4000}
        factor={3.2}
        saturation={0.4}
        fade
        speed={0.6}
      />

      {/* Closer, colorful floating stars */}
      {cuteStars.map((s) => (
        <CuteStar
          key={s.id}
          position={s.position}
          color={s.color}
          scale={s.scale}
          speed={s.speed}
        />
      ))}
    </group>
  )
}
