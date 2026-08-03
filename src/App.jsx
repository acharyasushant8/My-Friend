import { useCallback, useState } from 'react'
import { FaMusic } from 'react-icons/fa6'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'

import Scene from './components/Scene.jsx'
import ProposalCard from './components/ProposalCard.jsx'
import ConfettiEffect from './components/ConfettiEffect.jsx'
import { useYouTubeAudioPlayer } from './components/YouTubeMusicPlayer.jsx'

// Swap this for any other embeddable YouTube video id if you'd like a
// different background track.
const MUSIC_VIDEO_ID = 'qVHaXD7zHDQ'

export default function App() {
  const [status, setStatus] = useState('idle') // 'idle' | 'accepted'
  const { containerId, ready, playing, toggle } = useYouTubeAudioPlayer(MUSIC_VIDEO_ID)

  const handleYes = useCallback(() => {
    setStatus('accepted')
  }, [])

  return (
    <div className="app-root">
      {/* Fullscreen 3D scene sits behind everything */}
      <Scene accepted={status === 'accepted'} />

      {/* Foreground UI */}
      <ProposalCard status={status} onYes={handleYes} />

      {/* Celebration overlay */}
      <ConfettiEffect active={status === 'accepted'} />

      {/* Background music toggle, backed by a hidden YouTube player. */}
      <button
        type="button"
        className="music-toggle"
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? 'Pause background music' : 'Play background music'}
        title={!ready ? 'Loading music…' : playing ? 'Pause music' : 'Play music'}
      >
        <FaMusic className="music-note-icon" />
        {playing ? <HiSpeakerWave /> : <HiSpeakerXMark />}
      </button>

      {/* Visually hidden 1x1 mount point for the YouTube iframe player --
          only its audio is meant to be heard. */}
      <div className="yt-audio-mount" aria-hidden="true">
        <div id={containerId} />
      </div>
    </div>
  )
}
