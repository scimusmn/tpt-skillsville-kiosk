/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

function SelectModal(props) {
  const { setModalSel } = props;

  function choose(choice) {
    document.getElementById('modal').classList.add('modal-hide');
    document.getElementById('modal').classList.remove('modal-show');
    const selections = document.getElementsByClassName('selection-item');
    if (choice === 'yes') {
      setModalSel('yes');
      Object.keys(selections).forEach((i) => {
        selections[i].classList.add('hide-selection');
        selections[i].classList.remove('show-selection');
      });
    } else {
      Object.keys(selections).forEach((i) => {
        selections[i].classList.remove('hide-selection');
        selections[i].classList.add('show-selection');
      });
    }
  }

  return (
    <div id="modal" className="modal-container modal-hide">
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
};

export default SelectModal;
