import React from 'react'
import Slider from "react-slick";

const SliderComponent = ({ arrImages }) => {
    var settings = {
        dots: true, 
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 3000,
        autoplay: true,
        arrows: false
    };

    return (
        <Slider {...settings}>
            {arrImages.map((image) => (
                <img key={image} src={image} alt="slider" />
            ))}
        </Slider>

    )
}

export default SliderComponent