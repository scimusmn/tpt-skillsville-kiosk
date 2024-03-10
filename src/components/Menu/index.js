/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Swiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import data from '../../../static/main.json';

function Menu(props) {
  const { selectionItems, initialSlide } = props;

  // const selectionItems = selections.map((i, index) => (
  //   <SwiperSlide className={index % 2 === 0 ? 'bottom-slide' : 'top-slide'}>
  //     {index}
  //     <Selection
  //       key={i.titleDisplay}
  //       item={i}
  //       setCurrentSelection={setCurrentSelection}
  //       setModalShow={setModalShow}
  //       menuShow={menuShow}
  //     />
  //   </SwiperSlide>
  // ));

  function changeLang(lang) {
    console.log('change to ', lang);
  }

  const langBtns = data.locales.map((i) => {
    console.log(i);
    return <button type="button" className="lang-btn" onClick={() => changeLang(i.name)}>{i.name}</button>;
  });

  return (
    <>
      <Swiper
        initialSlide={initialSlide}
        slidesPerView={6.5}
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
      <div className="lang-btn-container">
        {langBtns}
      </div>
      <div className="logo">
        <img src="/assets/images/logo.png" alt="logo" />
      </div>
    </>
  );
}

Menu.propTypes = {
  selectionItems: PropTypes.array.isRequired,
  initialSlide: PropTypes.number.isRequired,
};

export default Menu;
