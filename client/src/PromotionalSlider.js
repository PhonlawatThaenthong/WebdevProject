import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';

const PromotionalSlider = ({ images }) => {
  const [imagesLoad, setImagesLoad] = useState(false);

  useEffect(() => {
    const preloadImages = () => {
      const imagePromise = images.map((image) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      Promise.all(imagePromise)
        .then(() => setImagesLoad(true))
        .catch((error) => console.error('error preloading images:', error));
    };

    preloadImages();
  }, [images]);

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
    <div className={`promotional-slider-wrapper ${imagesLoad ? 'show' : 'loading'}`}>
      {imagesLoad && (
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="slider-item">
              <img src={image} alt={`Promotion ${index + 1}`} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default PromotionalSlider;
