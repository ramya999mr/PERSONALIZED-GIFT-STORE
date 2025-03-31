import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { postData, shimmer, toBase64 } from "~/lib/clientFunctions";
import classes from "./product.module.css";

const Product = (props) => {
  const { session } = useSelector((state) => state.localSession);
  const settings = useSelector((state) => state.settings);

  const discountInPercent =
    Math.round(
      (100 - (props.product.discount * 100) / props.product.price) * 10,
    ) / 10;

  function stockInfo() {
    if (props.product.type === "simple") {
      return props.product.quantity > 0 ? true : false;
    }
    const qty = props.product.variants.reduce((a, b) => +a + +b.qty, 0);
    return qty > 0 ? true : false;
  }

  const addToWishList = async () => {
    try {
      if (!session) {
        return toast.warning("You need to login to create a Wishlist");
      }
      const data = {
        pid: props.product._id,
        id: session.user.id,
      };
      const response = await postData(`/api/wishlist`, data);
      response.success
        ? toast.success("Item has been added to wishlist")
        : response.exists
        ? toast.warning("This Item already exists on your wishlist")
        : toast.error("Something went wrong (500)");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className={`${classes.item} col-lg-3 col-md-4 col-6`}>
      <div className={classes.card}>
        <Link href={`/product/${props.product.slug}`}>
          <a>
            <div className={classes.container}>
              <Image
                className={classes.image}
                src={props.product.image[0].url}
                alt={props.product.name}
                width={300}
                height={300}
                layout="responsive"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(300, 300),
                )}`}
              />
            </div>
            {props.product.discount < props.product.price && (
              <div className={classes.discount}>-{discountInPercent}%</div>
            )}
            <div className={classes.nameContainer}>
              <div className={classes.name}>
                <p>{props.product.name}</p>
              </div>
              {/* <p
                className={classes.unit}
              >{`Stock : ${props.product.unit}`}</p> */}
              <p
                className={
                  props.product.discount < props.product.price
                    ? classes.price_ori
                    : classes.price
                }
              >
                {settings.settingsData.currency.symbol}&nbsp;
                {props.product.price}
              </p>
              {props.product.discount < props.product.price && (
                <p className={classes.price}>
                  
                  {settings.settingsData.currency.symbol}&nbsp;
                  {props.product.discount}
                </p>
              )}
            </div>
          </a>
        </Link>
        {props.button && (
          <div className={classes.buttonContainer}>
            {stockInfo() ? (
              <Link
                href={`/gallery?slug=${props.product.slug}`}
                as={`/product/${props.product.slug}`}
                scroll={false}
                shallow={true}
              >
                <a className={classes.button}>ADD TO CART</a>
              </Link>
            ) : (
              <button className={classes.button} disabled>
                OUT OF STOCK
              </button>
            )}
            <button onClick={addToWishList}>ADD TO WISHLIST</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
