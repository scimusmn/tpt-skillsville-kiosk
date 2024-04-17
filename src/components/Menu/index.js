/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Swiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import logo from '../../styles/img/logo.png';

function Menu(props) {
  const {
    selectionItems, initialSlide, onSlideChange, sound,
  } = props;

  const playAudio = () => {
    const pageSound = new Audio(sound);
    pageSound.play().catch((error) => {
      console.log('Could not play sound:', error);
    });
  };

  useEffect(() => {
    document.getElementsByClassName('swiper-button-next')[0].addEventListener('click', playAudio);
    document.getElementsByClassName('swiper-button-prev')[0].addEventListener('click', playAudio);
  }, []);

  const localSlideChange = (swiper) => {
    const { realIndex, slides } = swiper;
    // The spooky index we can catch is always 6 (slidesPerView)
    // less than the total number of slides.
    const errSlideIndex = slides.length - 6;
    // This hack ensures that when a video is selected while on the last page,
    // the swiper will retain the same page instead of reverting.
    if (realIndex === errSlideIndex) {
      setTimeout(() => {
        swiper.slideToLoop(errSlideIndex + 2, 0);
      }, 5);
    }
    onSlideChange(swiper);
  };

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
        navigation
        modules={[Pagination, Navigation]}
        className="mySwiper"
        onSlideChange={localSlideChange}
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
  sound: PropTypes.string.isRequired,
};

export default Menu;
