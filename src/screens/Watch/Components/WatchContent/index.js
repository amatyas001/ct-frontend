import React, { useState, useEffect } from 'react'
import ClassTranscribePlayer from './ClassTranscribePlayer'
import { SubHeader } from './SubHeader'
import './index.css'
import { NORMAL_MODE, EQUAL_MODE, PS_MODE, NESTED_MODE } from './constants'


export function WatchContent({ media, playlist, courseNumber }) {
  const [orderClassName, setOrderClassName] = useState('')
  const [primary, setPrimary] = useState(true)
  const [mode, setMode] = useState(NORMAL_MODE) // should be ps_mode if there is 2 videos in the future

  useEffect(() => {
    console.log(media) // should change mode based on the # of videos
  }, [media])

  useEffect(() => {
    const name = primary ? '' : 'switch-player'
    setOrderClassName(() => name)
  }, [primary])

  const [play, setPlay] = useState(false)
  const [currTime, setCurrTime] = useState(-1)
  const [playbackRate, setPlaybackRate] = useState(-1)
  const [trackSrc, setTrackSrc] = useState('')

  const handleFunctions = {
    switchScreen: () => setPrimary(() => !primary),
    switchToPrimary: () => setPrimary(() => true),
    switchToSecondary: () => setPrimary(() => false),
    syncPlay: () => setPlay(() => true),
    syncPause: () => setPlay(() => false),
    setCurrTime: currTime => setCurrTime(() => currTime),
    setPlaybackRate: rate => setPlaybackRate(() => rate),
    setTrackSrc: src => {
      console.log('change src to', src)
      setTrackSrc(() => src)
    },
    setMode: mode => setMode(() => mode),
  }

  var v1ClassName = primary ? 'primary' : 'secondary'
  var v2ClassName = primary ? 'secondary' : 'primary'
  if (mode === EQUAL_MODE) v1ClassName = v2ClassName = 'equal'
  else if (mode === NORMAL_MODE) {
    v1ClassName += '-normal'
    v2ClassName += '-normal'
  }

  const propsForSettingBar = {
    ...handleFunctions,
    mode: mode,
    show: true,
  }

  return (
    <div className="watch-content">
      <SubHeader 
        media={media} 
        playlist={playlist} 
        courseNumber={courseNumber} 
        propsForSettingBar={propsForSettingBar}
      />

      <div className={`player-container ${orderClassName}`}>
        <div className={`video-col ${v1ClassName}-col`} id="first-col">
          <ClassTranscribePlayer 
            {...handleFunctions}
            media={media} 
            primary={primary} mode={mode}
            play={play} currTime={currTime} playbackRate={playbackRate}
            trackSrc={trackSrc}
            video1
          />
        </div>

        <div className={`video-col ${v2ClassName}-col`} id="second-col">
          <ClassTranscribePlayer 
            {...handleFunctions}
            media={media}
            primary={!primary}  
            trackSrc={trackSrc} mode={mode}
            play={play} currTime={currTime} playbackRate={playbackRate}
          />
        </div>
      </div>
    </div>
  )
}