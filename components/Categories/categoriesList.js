import { A11y, Autoplay } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Category from "./categories";

const breakpointNewArrival = {
  320: {
    slidesPerView: 2,
  },
  560: {
    slidesPerView: 3,
  },
  991: {
    slidesPerView: 4,
  },
  1200: {
    slidesPerView: 6,
  },
};

function CategoryList(props) {
  if (!props.categoryList || !props.categoryList.length) {
    return null;
  }

  return (
    <div className="content_container">
      <div className="custom_container">
        <h2 className="content_heading">Top Categories</h2>
        <Swiper
          modules={[A11y, Autoplay]}
          // spaceBetween={0}
          slidesPerView="auto"
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
          {props.categoryList &&
            props.categoryList.map((category, index) => (
              <SwiperSlide key={category._id}>
                <Category
                  name={category.name}
                  slug={category.slug}
                  img={category.icon[0].url}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}

export default CategoryList;
