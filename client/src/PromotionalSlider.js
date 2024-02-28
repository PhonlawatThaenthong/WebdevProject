import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css'

const PromotionalSlider = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  
  };

  return (
    <div className="promotional-slider-wrapper">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slider-item">
            <img src={image} alt={`Promotion ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PromotionalSlider;
