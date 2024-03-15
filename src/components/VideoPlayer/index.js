/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useCaptions from '../../useCaptions';
import logo from '../../styles/img/logo.png';
import box from '../../styles/img/box2.svg';

function VideoPlayer(props) {
  const {
    currentSelection, pause, reset, setModalSel, videoShow, setVideoShow, setMenuShow,
  } = props;
  const videoRef = useRef(null);
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

    // pause idle timer during video playback
    pause();
  }

  function goBack() {
    videoRef.current.currentTime = 0;
    videoRef.current.pause();
    videoRef.src = '';
    setModalSel('');
    setVideoShow(false);
    setMenuShow(true);

    // resume idle timer
    reset();
  }

  function onVideoEnd() {
    goBack();
  }

  return (
    <div id="player-wrapper" className={`wrapper ${videoShow ? 'show-player-wrapper' : 'hide-player-wrapper'}`}>
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
            <p>{captions[index]}</p>
          </div>
          <img className="box" src={box} alt="box" />
          <img className="branding-logo" src={logo} alt="logo" />
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
  setModalSel: PropTypes.func.isRequired,
  videoShow: PropTypes.bool.isRequired,
  setVideoShow: PropTypes.func.isRequired,
  setMenuShow: PropTypes.func.isRequired,
};

export default VideoPlayer;
