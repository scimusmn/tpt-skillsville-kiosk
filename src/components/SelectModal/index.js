/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import border from '../../styles/img/border-svg.svg';

function SelectModal(props) {
  const {
    setModalSel,
    modalShow,
    setModalShow,
    setVideoShow,
    setMenuShow,
    currentSelection,
    noSound,
    yesSound,
  } = props;

  const soundRef = useRef(null);
  const yesSoundRef = useRef(null);
  const noSoundRef = useRef(null);

  const [startCloseAnimation, setStartCloseAnimation] = useState(false);
  const [startContinueAnimation, setStartContinueAnimation] = useState(false);

  // Play sound effect when modal shows
  useEffect(() => {
    if (modalShow) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch((error) => console.log('Could not play sound:', error));
    } else {
      soundRef.current.pause();
    }
  }, [modalShow]);

  useEffect(() => {
    if (startCloseAnimation) {
      noSoundRef.current.currentTime = 0;
      noSoundRef.current.play().catch((error) => console.log('Could not play sound:', error));
    } else {
      noSoundRef.current.pause();
    }
    if (startContinueAnimation) {
      yesSoundRef.current.currentTime = 0;
      yesSoundRef.current.play().catch((error) => console.log('Could not play sound:', error));
    } else {
      yesSoundRef.current.pause();
    }
  }, [startCloseAnimation, startContinueAnimation]);

  function choose(choice) {
    setModalShow(false);
    if (choice === 'yes') {
      setModalSel('yes');
      setVideoShow(true);
      setMenuShow(false);
    }
    if (choice === 'no') {
      setModalSel('no');
    }
  }

  function closeModal(choice) {
    if (choice === 'no') setStartCloseAnimation(false);
    if (choice === 'yes') setStartContinueAnimation(false);
    choose(choice);
  }

  return (
    <div id="modal" className={`modal-container ${modalShow ? 'modal-show' : 'modal-hide'}`}>
      <audio id="modalSound" src={currentSelection.narrationAsset} preload="auto" ref={soundRef} />
      <audio id="noSound" src={noSound} preload="auto" ref={noSoundRef} />
      <audio id="yesSound" src={yesSound} preload="auto" ref={yesSoundRef} />
      <div
        className="thumb-container thumb-modal"
        style={{
          backgroundImage:
        `url(${currentSelection.thumbnail.localFile.publicURL})`,
        }}
      />
      <img className="border border-modal" src={border} alt="border" draggable={false} />
      <div className="header">
        <div className="title-container">
          {currentSelection.titleDisplay}
        </div>
      </div>
      <div className="yes-no-container">
        <div
          onClick={() => setStartCloseAnimation(true)}
          onAnimationEnd={() => closeModal('no')}
          className={`no ${startCloseAnimation ? 'no-selected' : ''}`}
        />
        <div
          onClick={() => setStartContinueAnimation(true)}
          onAnimationEnd={() => closeModal('yes')}
          className={`yes ${startContinueAnimation ? 'yes-selected' : ''}`}
        />
      </div>
    </div>
  );
}

SelectModal.propTypes = {
  setModalSel: PropTypes.func.isRequired,
  setModalShow: PropTypes.func.isRequired,
  setVideoShow: PropTypes.func.isRequired,
  modalShow: PropTypes.bool.isRequired,
  setMenuShow: PropTypes.func.isRequired,
  currentSelection: PropTypes.object.isRequired,
  noSound: PropTypes.string.isRequired,
  yesSound: PropTypes.string.isRequired,
};

export default SelectModal;
