/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useCaptions from '../../useCaptions';

function VideoPlayer(props) {
  const { currentSelection, pause, reset } = props;
  const videoRef = useRef(null);
  const [fillAmount, setFillAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    videoRef.current?.load();
  }, [currentSelection]);

  useEffect(() => {
    // hack to hide loading indicator on mount before selection is made
    if (!currentSelection.videoAsset) {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  const captions = Object.keys(currentSelection.captionAssets).map(
    (locale) => useCaptions(videoRef, locale, true),
  );

  function onVideoLoad() {
    // Default captions are hidden, but need to be set to "showing" here to be recognized
    Object.keys(videoRef.current.textTracks).forEach((key) => {
      const track = videoRef.current.textTracks[key];
      if (track) {
        track.mode = 'showing';
        track.mode = 'hidden';
      }
      setIsLoading(false);
    });

    // progress bar animation
    videoRef.current.addEventListener('timeupdate', () => {
      const percent = videoRef.current.currentTime / videoRef.current.duration;
      // Round to avoid overloading state updates.
      // Multiply by 100 to get a whole number usable by CSS.
      const rounded = (Math.round(percent * 1000) / 1000) * 100;
      if (rounded !== fillAmount) setFillAmount(rounded);
    });

    // pause idle timer during video playback
    pause();
  }

  function goBack() {
    videoRef.current.currentTime = 0;
    videoRef.current.pause();
    videoRef.src = '';

    // Apply styles to show menu and hide list items
    const player = document.getElementById('player-wrapper');
    player.classList.add('hide-player-wrapper');
    player.classList.remove('show-player-wrapper');
    const selections = document.getElementsByClassName('selection-item');
    Object.keys(selections).forEach((i) => selections[i].classList.remove('hide-selection'));

    // resume idle timer
    reset();
  }

  function onVideoEnd() {
    goBack();
  }

  return (
    <div id="player-wrapper" className="wrapper hide-player-wrapper">
      <div id="player-container">
        <video
          id="video"
          ref={videoRef}
          onLoadedData={() => onVideoLoad()}
          onEnded={() => onVideoEnd()}
          onLoadStart={() => setIsLoading(true)}
        >
          <source src={currentSelection.videoAsset} />
          {Object.keys(currentSelection.captionAssets).map((locale) => {
            const captionFile = currentSelection.captionAssets[locale]?.localFile.publicURL;
            if (!captionFile) return null;
            return (
              <track
                key={locale}
                id={locale}
                srcLang={locale}
                src={captionFile}
                kind="subtitles"
                default
              />
            );
          })}
        </video>
      </div>
      {isLoading && <div className="loading">Loading...</div>}
      {Object.keys(currentSelection.captionAssets).map((locale, index) => (
        <div key={locale}>
          <div key={locale} className={`captions captions${index} ${locale}`}>
            {captions[index]}
          </div>
          <div className={`progress ${locale}`}>
            <div className={`progress-fill ${locale}`} style={{ width: `${fillAmount}%` }} />
          </div>
          <div className="transport-container" onClick={() => goBack()}>
            <div className="icon" />
          </div>
        </div>
      ))}
    </div>
  );
}

VideoPlayer.propTypes = {
  currentSelection: PropTypes.objectOf(PropTypes.any).isRequired,
  pause: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default VideoPlayer;
