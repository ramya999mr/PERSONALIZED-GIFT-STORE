import Link from "next/link";
import { useState, useEffect } from "react";
import classes from "./banner.module.css";

const Banner = (props) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = props.banners || [];

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000); // Change banner every 5 seconds

      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className={classes.banner_container}>
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`${classes.banner} ${index === currentBanner ? classes.active : ''}`}
          style={{ backgroundImage: `url(${banner.image[0].url})` }}
        >
          <div className={classes.content}>
            <h1 className={classes.heading}>{banner.title}</h1>
            <p className={classes.subheading}>{banner.subtitle}</p>
            <p className={classes.body}>{banner.description}</p>
            <Link href={banner.url}>
              <a className={classes.button}>SHOP NOW</a>
            </Link>
          </div>
        </div>
      ))}
      {banners.length > 1 && (
        <div className={classes.indicators}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${classes.indicator} ${index === currentBanner ? classes.active : ''}`}
              onClick={() => setCurrentBanner(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
