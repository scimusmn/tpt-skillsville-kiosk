/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Swiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

function Menu(props) {
  const { selectionItems } = props;

  return (
    <>
      <div className="logo">
        <img src="/assets/images/logo.png" alt="logo" />
      </div>
      <Swiper
        slidesPerView={6.5}
        slidesPerGroup={4}
        spaceBetween={225}
        loop
        pagination={{
          clickable: true,
        }}
        navigation
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {selectionItems}
      </Swiper>
    </>
  );
}

Menu.propTypes = {
  selectionItems: PropTypes.array.isRequired,
};

export default Menu;
