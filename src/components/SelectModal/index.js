/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import border from '../../styles/img/border-svg.svg';

function SelectModal(props) {
  const {
    setModalSel, modalShow, setModalShow, setVideoShow, setMenuShow, currentSelection,
  } = props;

  const soundRef = useRef(null);

  // Play sound effect when modal shows
  useEffect(() => {
    if (modalShow) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch((error) => console.log('Could not play sound:', error));
    } else {
      soundRef.current.pause();
    }
  }, [modalShow]);

  function choose(choice) {
    setModalShow(false);
    if (choice === 'yes') {
      setModalSel('yes');
      setVideoShow(true);
      setMenuShow(false);
    }
  }
  console.log(choose);

  return (
    <div id="modal" className={`modal-container ${modalShow ? 'modal-show' : 'modal-hide'}`}>
      <audio id="modalSound" src={currentSelection.narrationAsset} preload="auto" ref={soundRef} />
      <div
        className="thumb-container thumb-modal"
        style={{
          backgroundImage:
        `url(${currentSelection.thumbnail.localFile.publicURL})`,
        }}
      />
      <img className="border border-modal" src={border} alt="border" />
      <div className="header">
        <div className="title-container">
          {currentSelection.titleDisplay}
        </div>
      </div>
      <div className="yes-no-container">
        <div className="no" onClick={() => choose('no')} />
        <div className="yes" onClick={() => choose('yes')} />
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
};

export default SelectModal;
