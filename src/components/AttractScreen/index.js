/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const VideoSelectionKeys = {
  RANDOM: 'RANDOM', // Select a random video from all selections in video selector
  BOUNCING_LOGO: 'BOUNCING_LOGO', // Bouncing logo animation (TODO)
};

function AttractScreen({
  pause, reset, menuShow, setMenuShow, videoShow, playlist, videoPool,
}) {
  const videoRef = useRef(null);
  const [playbackIndex, setPlaybackIndex] = useState(0);

  const getNextVideo = () => {
    const nextIndex = (playbackIndex + 1) % playlist.length;
    setPlaybackIndex(nextIndex);
    return playlist[nextIndex];
  };

  const selectRandomVideo = () => videoPool[Math.floor(Math.random() * videoPool.length)];

  const onVideoLoad = () => {
    pause(); // Pause idle timer during video playback
  };

  const onVideoEnd = () => {
    let nextVideo = getNextVideo();
    if (nextVideo === VideoSelectionKeys.RANDOM) {
      nextVideo = selectRandomVideo();
    }
    if (nextVideo === VideoSelectionKeys.BOUNCING_LOGO) {
      console.warn('Bouncing logo not implemented yet!');
    } else {
      videoRef.current.src = nextVideo;
      videoRef.current.play();
    }
  };

  const goToMenu = () => {
    videoRef.current.pause();
    // videoRef.current.src = ''; // Clear current video
    setMenuShow(true);
    reset(); // Resume idle timer
  };

  const wrapperClass = menuShow || videoShow ? 'hide-attract-wrapper' : '';

  return (
    <div
      className={`attract-wrapper ${wrapperClass}`}
      onClick={goToMenu}
    >
      <div id="attract-container" className="attract-container">
        <video
          autoPlay
          muted
          id="attract-video"
          ref={videoRef}
          onLoadedData={onVideoLoad}
          onEnded={onVideoEnd}
          src={playlist[0]}
        />
      </div>
      <div className="attract-cta">
        <div className="attract-cta-text-ring" />
        <div className="attract-cta-bg-ring" />
        <div className="cta-button">
          <div className="background" />
          <div className="button" />
          <div className="foreground" />
        </div>
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
