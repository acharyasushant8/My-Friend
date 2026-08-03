import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Loads the official YouTube IFrame Player API (once per page) and
 * returns a ready-to-use player instance for the given video id.
 *
 * The player renders into a 1x1, visually hidden container -- only its
 * audio is meant to be heard, driven entirely by the on-screen music
 * toggle button rather than YouTube's own visible controls.
 *
 * Note: this only works for videos whose owner has allowed embedding.
 * If embedding is disabled for a given video, `ready` will stay false
 * and the toggle button will simply no-op.
 */
export function useYouTubeAudioPlayer(videoId) {
  const containerId = useRef(`yt-audio-player-${videoId}`)
  const playerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    let cancelled = false

    function createPlayer() {
      if (cancelled || playerRef.current) return
      playerRef.current = new window.YT.Player(containerId.current, {
        videoId,
        width: '1',
        height: '1',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: videoId, // required by YouTube for looping a single video
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(40)
            setReady(true)
          },
          onStateChange: (event) => {
            // 1 = playing, others (paused/ended/buffering/cued) => not playing
            setPlaying(event.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      // Queue our player creation behind the API's global ready callback,
      // chaining onto any other listener that may already be registered.
      const previousCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.()
        createPlayer()
      }

      if (!document.getElementById('youtube-iframe-api')) {
        const script = document.createElement('script')
        script.id = 'youtube-iframe-api'
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
    }

    return () => {
      cancelled = true
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  const toggle = useCallback(() => {
    const player = playerRef.current
    if (!player || !ready) return

    if (playing) {
      player.pauseVideo()
    } else {
      // Runs inside a user click handler, so autoplay-with-sound is allowed.
      player.unMute()
      player.playVideo()
    }
  }, [playing, ready])

  return {
    containerId: containerId.current,
    ready,
    playing,
    toggle,
  }
}
