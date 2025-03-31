import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import classes from "./productList.module.css";

function ProductCard(props) {
  const settings = useSelector((state) => state.settings);
  const shimmer = (w, h) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#efefef" offset="20%" />
        <stop stop-color="#bbbbbb" offset="50%" />
        <stop stop-color="#efefef" offset="80%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#f6f7f8" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
  </svg>`;

  const toBase64 = (str) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return (
    <div className={classes.page_wrapper}>
      <div className={classes.page_inner}>
        <div className={classes.row}>
          <div className={classes.el_wrapper}>
            <Link href={`/product/${props.data.slug}`}>
              <a>
                <div className={classes.box_up}>
                  <div className={classes.img}>
                    <Image
                      className={classes.image}
                      src={props.data.image[0].url}
                      alt={props.data.name}
                      width={280}
                      height={280}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(300, 300),
                      )}`}
                    />
                  </div>
                  <div className={classes.img_info}>
                    <div className={classes.info_inner}>
                      <span className={classes.p_name}>{props.data.name}</span>
                      <span
                        className={classes.p_company}
                      >{`Stock : ${props.data.quantity}`}</span>
                    </div>
                    <div className={classes.a_size}>
                      <span className={classes.size}>{priceDetails()}</span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
            <div className={classes.box_down}>
              <div className={classes.h_bg}>
                <div className={classes.h_bg_inner}></div>
              </div>
              <Link
                href={`/?slug=${props.data.slug}`}
                as={`/product/${props.data.slug}`}
                scroll={false}
              >
                <a>
                  <div className={classes.cart}>
                    <div className={classes.price}>{priceDetails()}</div>
                    <span className={classes.add_to_cart}>
                      <span className={classes.txt}>Add to cart</span>
                    </span>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function priceDetails() {
    return (
      <>
        <p
          className={
            props.data.discount < props.data.price
              ? classes.price_ori
              : classes.price_a
          }
        >
          {settings.settingsData.currency.symbol}&nbsp;
          {props.data.price}
        </p>
        {props.data.discount < props.data.price && (
          <p className={classes.price_a}>
            {settings.settingsData.currency.symbol}&nbsp;
            {props.data.discount}
          </p>
        )}
      </>
    );
  }
}

export default ProductCard;
