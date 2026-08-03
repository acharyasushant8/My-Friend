import { useEffect, useMemo, useState } from 'react'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'

const HEART_EMOJIS = ['💙', '💖', '💕', '💗', '✨', '🎉']

function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

/** One emoji that flies outward from the center of the screen and fades. */
function FlyingHeart({ delay, angle, distance, emoji, size }) {
  const dx = Math.cos(angle) * distance
  const dy = Math.sin(angle) * distance

  return (
    <motion.span
      className="flying-heart"
      style={{ fontSize: size }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: dx,
        y: dy,
        scale: [0.4, 1, 1, 0.7],
        rotate: angle > Math.PI ? -180 : 180,
      }}
      transition={{ duration: 2.4, delay, ease: 'easeOut' }}
    >
      {emoji}
    </motion.span>
  )
}

/**
 * Full celebration overlay: confetti rain from react-confetti, plus a
 * radial burst of heart/sparkle emoji exploding out from the card.
 * Mounted only while `active` is true.
 */
export default function ConfettiEffect({ active }) {
  const { width, height } = useWindowSize()

  const hearts = useMemo(() => {
    if (!active) return []
    return new Array(28).fill(0).map((_, i) => ({
      id: i,
      angle: (i / 28) * Math.PI * 2 + Math.random() * 0.3,
      distance: 140 + Math.random() * 220,
      emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
      size: 20 + Math.random() * 22,
      delay: Math.random() * 0.5,
    }))
  }, [active])

  if (!active) return null

  return (
    <div className="confetti-layer">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={280}
        recycle={false}
        gravity={0.25}
        colors={['#93c5fd', '#c4b5fd', '#f9a8d4', '#fef08a', '#ffffff']}
        tweenDuration={8000}
      />
      <div className="heart-burst-origin">
        {hearts.map((h) => (
          <FlyingHeart
            key={h.id}
            delay={h.delay}
            angle={h.angle}
            distance={h.distance}
            emoji={h.emoji}
            size={h.size}
          />
        ))}
      </div>
    </div>
  )
}
