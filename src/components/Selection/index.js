/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import border from '../../styles/img/border-svg.svg';

function Selection(props) {
  const {
    item, setCurrentSelection, setModalShow, menuShow,
  } = props;

  function popModal() {
    setModalShow(true);
    setCurrentSelection(item);
  }

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '60px',
      }}
      >
        {item.titleDisplay}
      </div>
      <div className={`${menuShow ? 'show-selection' : 'hide-selection'}`} onClick={() => popModal()}>
        <div
          className="thumb-container"
          style={{
            backgroundImage:
        `url(${item.thumbnail.localFile.publicURL})`,
          }}
        />
        <img className="border" src={border} alt="border" />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 518 469">
        <defs>
          <clipPath id="myClip">
            <path d="M143.997 35.1431C149.355 25.8791 159.242 20.1708 169.944 20.1627L348.096 20.0282C358.822 20.0201 368.736 25.7391 374.099 35.0282L463.014 189.032C468.377 198.321 468.372 209.767 463.002 219.052L373.81 373.269C368.452 382.533 358.565 388.242 347.863 388.25L169.711 388.384C158.985 388.392 149.07 382.673 143.707 373.384L54.7928 219.38C49.4298 210.091 49.4341 198.645 54.8041 189.36L143.997 35.1431Z" fill="white" fillOpacity="0.4" shapeRendering="crispEdges" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
}

Selection.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  setCurrentSelection: PropTypes.func.isRequired,
  setModalShow: PropTypes.func.isRequired,
  menuShow: PropTypes.bool.isRequired,
};

export default Selection;
