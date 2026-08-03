import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaHeart, FaHeartCircleCheck } from 'react-icons/fa6'
import { HiSparkles } from 'react-icons/hi2'

const FUNNY_MESSAGES = [
  'Are you sure? 🥺',
  'Give me one chance 😅',
  'Friends are awesome! 💙',
  "You can't escape forever 😂",
]

const MAX_ATTEMPTS = 8

/**
 * Picks a random viewport position (as vh/vw strings) for the runaway
 * "Maybe" button, staying within a safe margin so it never gets stuck
 * off-screen or under a notch/edge.
 */
function randomEscapePosition() {
  const top = 12 + Math.random() * 66 // 12vh - 78vh
  const left = 8 + Math.random() * 74 // 8vw - 82vw
  return { top: `${top}vh`, left: `${left}vw` }
}

export default function ProposalCard({ status, onYes }) {
  const [attempts, setAttempts] = useState(0)
  const [escaped, setEscaped] = useState(false)
  const [maybePos, setMaybePos] = useState({ top: '60%', left: '60%' })
  const [funnyMessage, setFunnyMessage] = useState('')
  const messageTimeout = useRef(null)

  const maybeVisible = attempts < MAX_ATTEMPTS

  const handleMaybeInteraction = useCallback(
    (e) => {
      if (e) e.preventDefault()
      if (attempts >= MAX_ATTEMPTS) return

      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)
      setEscaped(true)
      setMaybePos(randomEscapePosition())
      setFunnyMessage(FUNNY_MESSAGES[(nextAttempts - 1) % FUNNY_MESSAGES.length])

      clearTimeout(messageTimeout.current)
      messageTimeout.current = setTimeout(() => setFunnyMessage(''), 1800)
    },
    [attempts],
  )

  useEffect(() => () => clearTimeout(messageTimeout.current), [])

  return (
    <>
      {/* ---- Center glassmorphism card ---- */}
      <div className="stage">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            {status !== 'accepted' ? (
              <motion.div
                key="ask"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card-icon">
                  <FaHeart />
                </div>
                <h1 className="headline">Will You Be My Friend? 💙</h1>
                <p className="subheading">
                  Friendship makes every journey brighter. I&rsquo;d love to have you as
                  my friend.
                </p>

                <div className="button-row">
                  <motion.button
                    type="button"
                    className="btn btn-yes"
                    onClick={onYes}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💙 Yes, I&rsquo;d Love To!
                  </motion.button>

                  {/* Inline placeholder keeps layout balanced once the
                      real runaway button has escaped the card */}
                  {maybeVisible && !escaped && (
                    <motion.button
                      type="button"
                      className="btn btn-maybe"
                      onMouseEnter={handleMaybeInteraction}
                      onTouchStart={handleMaybeInteraction}
                      onClick={handleMaybeInteraction}
                      whileTap={{ scale: 0.95 }}
                    >
                      🤭 Maybe...
                    </motion.button>
                  )}
                  {maybeVisible && escaped && <span className="btn-ghost" aria-hidden />}
                </div>

                <p className="hint-text">
                  {maybeVisible
                    ? 'Hover the buttons above ✨'
                    : "I knew you'd say yes eventually 😊"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="accepted"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              >
                <motion.div
                  className="card-icon card-icon-happy"
                  animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.6 }}
                >
                  <FaHeartCircleCheck />
                </motion.div>
                <h1 className="headline">Yay!! 🎉</h1>
                <p className="subheading big">
                  You just made my day!
                  <br />
                  Thanks for being my friend ❤️
                </p>
                <motion.div
                  className="sparkle-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <HiSparkles /> <HiSparkles /> <HiSparkles />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ---- Runaway "Maybe" button, escapes into fixed viewport space ---- */}
      <AnimatePresence>
        {status !== 'accepted' && maybeVisible && escaped && (
          <motion.button
            key="maybe-escaped"
            type="button"
            className="btn btn-maybe btn-maybe-escaped"
            style={{ top: maybePos.top, left: maybePos.left }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, top: maybePos.top, left: maybePos.left }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onMouseEnter={handleMaybeInteraction}
            onTouchStart={handleMaybeInteraction}
            onClick={handleMaybeInteraction}
          >
            🤭 Maybe...
          </motion.button>
        )}
      </AnimatePresence>

      {/* ---- Funny floating message bubble ---- */}
      <AnimatePresence>
        {status !== 'accepted' && funnyMessage && (
          <motion.div
            key={funnyMessage + attempts}
            className="funny-bubble"
            style={{
              top: `calc(${escaped ? maybePos.top : '60%'} - 3.2rem)`,
              left: escaped ? maybePos.left : '60%',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.8 }}
            transition={{ duration: 0.35 }}
          >
            {funnyMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Attempt counter, purely decorative feedback ---- */}
      {status !== 'accepted' && attempts > 0 && maybeVisible && (
        <div className="attempt-counter">
          attempt {attempts} / {MAX_ATTEMPTS}
        </div>
      )}
    </>
  )
}
