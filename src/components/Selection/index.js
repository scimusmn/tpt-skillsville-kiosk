/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';

function Selection(props) {
  const { item, setCurrentSelection } = props;

  function popModal() {
    document.getElementById('modal').classList.add('modal-show');
    document.getElementById('modal').classList.remove('modal-hide');
    setCurrentSelection(item);
  }

  return (
    <div className="selection-item hide-selection" onClick={() => popModal()}>
      <div className="image-container">
        <img src={item.thumbnail.localFile.publicURL} alt="thumbnail" />
      </div>
      {Object.keys(item.titleDisplays).map((locale, i) => {
        const title = item.titleDisplays[locale];
        return (
          <React.Fragment key={i}>
            {i !== 0 && <hr className={`divider ${locale}`} />}
            <h4 className={`selection-title ${locale}`}>{title}</h4>
          </React.Fragment>
        );
      })}
    </div>
  );
}

Selection.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  setCurrentSelection: PropTypes.func.isRequired,
};

export default Selection;
