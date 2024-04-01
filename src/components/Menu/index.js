/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Swiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import logo from '../../styles/img/logo.png';

function Menu(props) {
  const { selectionItems, initialSlide, onSlideChange } = props;

  return (
    <>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <Swiper
        initialSlide={initialSlide}
        slidesPerView={6}
        slidesPerGroup={4}
        spaceBetween={80}
        loop
        pagination={{
          clickable: true,
        }}
        navigation
        modules={[Pagination, Navigation]}
        className="mySwiper"
        onSlideChange={onSlideChange}
        allowTouchMove={false}
      >
        {selectionItems}
      </Swiper>
    </>
  );
}

Menu.propTypes = {
  selectionItems: PropTypes.array.isRequired,
  initialSlide: PropTypes.number.isRequired,
  onSlideChange: PropTypes.func.isRequired,
};

export default Menu;
