/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

function SelectModal(props) {
  const {
    setModalSel, modalShow, setModalShow, setVideoShow, setMenuShow,
  } = props;

  function choose(choice) {
    setModalShow(false);
    if (choice === 'yes') {
      setModalSel('yes');
      setVideoShow(true);
      setMenuShow(false);
    }
  }

  return (
    <div id="modal" className={`modal-container ${modalShow ? 'modal-show' : 'modal-hide'}`}>
      <div className="yes" onClick={() => choose('yes')}>
        Yes
      </div>
      <div className="no" onClick={() => choose('no')}>
        No
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
};

export default SelectModal;
