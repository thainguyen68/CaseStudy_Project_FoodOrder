import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';

function Banner() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} interval={2000} pause={false}>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height:`250px`}}
                    src="../static/img/banner3.png"
                    alt="Second slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height:`250px`}}
                    src="../static/img/banner4.png"
                    alt="Second slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{height:`250px`}}
                    src="../static/img/banner1.png"
                    alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height:`250px`}}
                    src="../static/img/banner2.png"
                    alt="Second slide"
                />
            </Carousel.Item>
            {/* Add more Carousel.Item for additional images */}
        </Carousel>
    );
}

export default Banner;
