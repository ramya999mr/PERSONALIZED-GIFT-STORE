import { CaretLeft, CaretRight } from "@styled-icons/bootstrap";
import { useState } from "react";
import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./productCard";

const breakpointNewArrival = {
  320: {
    slidesPerView: 2,
  },
  991: {
    slidesPerView: 3,
  },
  1200: {
    slidesPerView: 4,
  },
  1600: {
    slidesPerView: 5,
  },
};

function ProductList(props) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  if (!props.item || !props.item.length) {
    return null;
  }

  return (
    <div className="content_container">
      <div className="custom_container">
        <h2 className="content_heading">{props.title}</h2>
        <div className="navigation-wrapper">
          <Swiper
            modules={[Navigation, A11y, Autoplay]}
            spaceBetween={10}
            slidesPerView="auto"
            navigation={{ prevEl, nextEl }}
            breakpoints={breakpointNewArrival}
            className="_feature_slider"
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            loop={false}
            centeredSlides={false}
            centerInsufficientSlides={true}
          >
            {props.item.map((item) => (
              <SwiperSlide key={item._id}>
                <ProductCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="swiper-button-prev arrow arrow--left"
            ref={(node) => setPrevEl(node)}
          >
            <CaretLeft width={17} height={17} />
          </div>
          <div
            className="swiper-button-next arrow arrow--right"
            ref={(node) => setNextEl(node)}
          >
            <CaretRight width={17} height={17} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
