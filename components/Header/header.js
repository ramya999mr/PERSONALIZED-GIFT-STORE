import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import classes from "./header.module.css";

function Header(props) {
  if (!props.carousel) return null;

  return (
    <div className="col-12 custom-carousel">
      <div className={classes.header}>
        <Carousel
          showArrows={false}
          showThumbs={false}
          showIndicators={true}
          emulateTouch={true}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          stopOnHover={true}
          interval={9000}
          transitionTime={900}
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={50}
        >
          {props.carousel.carouselData &&
            props.carousel.carouselData.map((item) => (
              <div className={classes.Header_container} key={item.id}>
                <div className={classes.img_content}>
                  <div className={classes.img_container}>
                    <Image
                      src={item.image[0].url}
                      width={1920}
                      height={1080}
                      alt={item.title}
                      priority
                    />
                  </div>
                </div>
              </div>
            ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Header;
