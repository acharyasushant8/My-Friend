import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/** Classic bezier heart outline, extruded into a soft 3D shape. */
function createHeartShape() {
  const shape = new THREE.Shape()
  const x = 0
  const y = 0

  shape.moveTo(x + 0.25, y + 0.25)
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y)
  shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35)
  shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95)
  shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35)
  shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y)
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.15, x + 0.25, y + 0.25)

  return shape
}

function useHeartGeometry(depth = 0.35) {
  return useMemo(() => {
    const shape = createHeartShape()
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 6,
      curveSegments: 24,
    })
    geometry.center()
    // Hearts are usually drawn "upside down" in shape-space; flip + rotate
    // so the point faces down the way a heart naturally sits.
    geometry.rotateZ(Math.PI)
    geometry.rotateY(Math.PI)
    return geometry
  }, [depth])
}

/**
 * The big glowing centerpiece heart. Gently floats, rotates, and can
 * "pulse" faster/brighter once the proposal has been accepted.
 */
export default function FloatingHeart({ excited = false, position = [0, 0.3, -2.6] }) {
  const groupRef = useRef()
  const materialRef = useRef()
  const geometry = useHeartGeometry(0.4)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (groupRef.current) {
      // slow ambient bob + spin, faster/bigger once excited
      const speed = excited ? 2.2 : 1
      groupRef.current.rotation.y = Math.sin(t * 0.4 * speed) * 0.6
      groupRef.current.position.y =
        position[1] + Math.sin(t * 0.8 * speed) * (excited ? 0.25 : 0.15)

      const pulse = excited ? 1 + Math.sin(t * 4) * 0.08 : 1 + Math.sin(t * 1.2) * 0.03
      groupRef.current.scale.setScalar(pulse)
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = excited
        ? 1.6 + Math.sin(t * 5) * 0.4
        : 0.55 + Math.sin(t * 1.5) * 0.1
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={groupRef} position={position}>
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            ref={materialRef}
            color={excited ? '#ff6fa5' : '#ff9ecb'}
            emissive={excited ? '#ff3d81' : '#c026d3'}
            emissiveIntensity={1.2}
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>
      </group>
    </Float>
  )
}

/** A single small heart used inside the celebratory burst. */
function BurstHeart({ startPosition, direction, color, delaySeed }) {
  const ref = useRef()
  const geometry = useHeartGeometry(0.15)
  const birth = useRef(Math.random() * 0.6 + delaySeed)

  useFrame((state, delta) => {
    if (!ref.current) return
    const life = state.clock.getElapsedTime() - birth.current
    if (life < 0) return

    ref.current.position.x = startPosition[0] + direction[0] * life * 1.6
    ref.current.position.y = startPosition[1] + direction[1] * life * 1.6 - life * life * 0.6
    ref.current.position.z = startPosition[2] + direction[2] * life * 1.6
    ref.current.rotation.x += delta * 2
    ref.current.rotation.y += delta * 1.4

    const fade = Math.max(0, 1 - life / 2.5)
    ref.current.scale.setScalar(fade * 0.6)
  })

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />
    </mesh>
  )
}

/**
 * A joyful explosion of small hearts, radiating out from the center.
 * Mounted only once the user accepts the proposal.
 */
export function HeartBurst({ count = 26 }) {
  const palette = ['#ff8fc7', '#ffd1e8', '#c4b5fd', '#93c5fd', '#f9a8d4']

  const hearts = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const angle = (i / count) * Math.PI * 2
      const upward = Math.random() * 0.6 + 0.4
      return {
        id: i,
        direction: [Math.cos(angle), upward, Math.sin(angle)],
        color: palette[i % palette.length],
        delaySeed: Math.random() * 0.4,
      }
    })
  }, [count])

  return (
    <group>
      {hearts.map((h) => (
        <BurstHeart
          key={h.id}
          startPosition={[0, 0.3, -2]}
          direction={h.direction}
          color={h.color}
          delaySeed={h.delaySeed}
        />
      ))}
    </group>
  )
}
