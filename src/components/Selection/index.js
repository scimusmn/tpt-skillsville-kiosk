/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';

function Selection(props) {
  const {
    item, setCurrentSelection, setModalShow, menuShow,
  } = props;

  function popModal() {
    setModalShow(true);
    setCurrentSelection(item);
  }

  return (
    <div className={`hexagon ${menuShow ? 'show-selection' : 'hide-selection'}`} onClick={() => popModal()}>
      <div className="shape">
        <img src={item.thumbnail.localFile.publicURL} alt="thumbnail" />
      </div>
      <img src="/assets/images/border.png" alt="border" width={400} height={100} />
    </div>
  );
}

Selection.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  setCurrentSelection: PropTypes.func.isRequired,
  setModalShow: PropTypes.func.isRequired,
  menuShow: PropTypes.bool.isRequired,
};

export default Selection;
