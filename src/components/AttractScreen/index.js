/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import data from '../../../static/locales/en-US.json';

function AttractScreen(props) {
  const {
    pause, reset, menuShow, setMenuShow, videoShow,
  } = props;
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const numSelections = data.attractSelections.length;
  const [currentSelection, setCurrentSelection] = useState(0);

  function getRandomSel(max, current) {
    const selection = Math.floor(Math.random() * max);
    if (selection !== current) setCurrentSelection(selection);
    if (selection === current) {
      // select video within array
      if (current + 1 <= numSelections) {
        setCurrentSelection(current + 1);
      }
      if (current - 1 >= 0) {
        setCurrentSelection(current - 1);
      }
    }
  }

  const [attractVideo, setAttractVideo] = useState(data.attractSelections[0]);

  useEffect(() => {
    videoRef.current?.load();
  }, [attractVideo, currentSelection]);

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
    getRandomSel(numSelections, currentSelection);
    setAttractVideo(data.attractSelections[currentSelection]);
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
};

export default AttractScreen;
