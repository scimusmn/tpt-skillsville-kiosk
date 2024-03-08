/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function AttractScreen(props) {
  const {
    pause, reset, menuShow, setMenuShow, videoShow, playlist, videoPool,
  } = props;
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line prefer-const
  let [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  // Special playlist keys
  const RANDOM_VIDEO_SELECTION_KEY = 'RANDOM_SELECTION';
  const BOUNCING_LOGO_KEY = 'BOUNCING_LOGO';

  const numSelections = playlist.length - 1;

  function getNextVideoInPlaylist() {
    setCurrentPlaylistIndex(currentPlaylistIndex += 1);
    console.log('currentPlaylistIndex', currentPlaylistIndex);
    if (currentPlaylistIndex > numSelections) {
      setCurrentPlaylistIndex(0);
      console.log('got here');
    }
    return playlist[currentPlaylistIndex];
  }

  function randomFishArray(array) {
    return Math.floor(Math.random() * array.length);
  }

  const [attractVideo, setAttractVideo] = useState(playlist[0]);

  useEffect(() => {
    videoRef.current?.load();
  }, [attractVideo, currentPlaylistIndex]);

  useEffect(() => {
    // hack to hide loading indicator on mount before selection is made
    if (!attractVideo) {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  function onVideoLoad() {
    setIsLoading(false);
    // pause idle timer during video playback
    pause();
  }

  function goToMenu() {
    videoRef.current.currentTime = 0;
    videoRef.current.pause();
    videoRef.src = '';
    setMenuShow(true);
    // resume idle timer
    reset();
  }

  // Load new video on end
  function onVideoEnd() {
    let nextVideo = getNextVideoInPlaylist();
    console.log('next video:', nextVideo);
    if (nextVideo === RANDOM_VIDEO_SELECTION_KEY || nextVideo === BOUNCING_LOGO_KEY) {
      const randomIndex = randomFishArray(videoPool);
      nextVideo = videoPool[randomIndex];
      if (nextVideo === attractVideo) {
        console.log('need a random index!', randomIndex);
        // select video within array
        if (randomIndex + 1 <= numSelections) {
          setAttractVideo(randomIndex + 1);
        }
        if (randomIndex - 1 >= 0) {
          setAttractVideo(randomIndex - 1);
        }
      }
      console.log(attractVideo, 'attract video (current)');
      console.log('oooh random!:', nextVideo);
    }
    setAttractVideo(nextVideo);
    videoRef.src = attractVideo;
  }

  return (
    <div className={`attract-wrapper ${menuShow || videoShow ? 'hide-attract-wrapper' : ''}`}>
      <div id="attract-container">
        <video
          autoPlay
          muted
          id="attract-video"
          ref={videoRef}
          onLoadedData={() => onVideoLoad()}
          onEnded={() => onVideoEnd()}
          onLoadStart={() => setIsLoading(true)}
        >
          <source src={attractVideo} />
        </video>
      </div>
      {isLoading && <div className="loading">Loading...</div>}
      <div className="attract-cta" onClick={() => goToMenu()}>
        START!
      </div>
    </div>
  );
}

AttractScreen.propTypes = {
  pause: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  menuShow: PropTypes.bool.isRequired,
  setMenuShow: PropTypes.func.isRequired,
  videoShow: PropTypes.bool.isRequired,
  playlist: PropTypes.array.isRequired,
  videoPool: PropTypes.array.isRequired,
};

export default AttractScreen;
