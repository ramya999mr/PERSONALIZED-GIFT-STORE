import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { postData } from "~/lib/clientFunctions";
import {
  applyCoupon,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "~/redux/cart.slice";
import classes from "./cartPage.module.css";

const CartPage = () => {
  const couponCode = useRef("");
  const cart = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const router = useRouter();
  const { session } = useSelector((state) => state.localSession);
  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const getTotalPrice = decimalBalance(
    cart.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0,
    ),
  );

 const getTotalGST = decimalBalance(
 cart.items.reduce((n, {gst_amount,qty}) => n + parseInt(gst_amount)*qty, 0)
  );

  const discountPrice = decimalBalance(
    getTotalPrice - (cart.coupon.discount / 100) * getTotalPrice,
  );

  const checkMaxQty = (uid) => {
    const product = cart.items.find((item) => item.uid === uid);
    if (product && product.quantity === -1) {
      return true;
    }
    return product && product.quantity >= product.qty + 1;
  };

  const increaseQty = (uid) => {
    if (checkMaxQty(uid)) {
      dispatch(incrementQuantity(uid));
    } else {
      toast.error("This item is out of stock!");
    }
  };

  const decreaseQty = (uid) => {
    dispatch(decrementQuantity(uid));
  };

  const validateCoupon = (data) => {
    const coupon = {
      code: data.code,
      discount: data.discount,
    };
    dispatch(applyCoupon(coupon));
  };

  const checkCoupon = async () => {
    try {
      const data = await postData("/api/order/coupon", {
        code: couponCode.current.value.trim(),
      });
      data && data.success
        ? (toast.success(data.message), validateCoupon(data))
        : toast.error(data.message);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
    }
  };

  const checkoutProcess = () => {
    if (settings.settingsData.security.loginForPurchase && !session) {
      toast.info("Please Login To Continue");
      router.push("/signin");
    } else {
      router.push("/checkout");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className={classes.container}>
        <h1>Your cart is empty</h1>
      </div>
    );
  }

  console.log(cart.items);

  var finalDiscount=0;
  for (const productData of cart.items) {
    finalDiscount += productData.original_price-productData.price;
    finalDiscount = decimalBalance(finalDiscount*productData.qty)
}


  return (
    <div className={classes.container}>
      <h1>Your Cart</h1>
      <div className={classes.header}>
        <p>Image</p>
        <p>Name</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Actions</p>
        <p>Total Price</p>
      </div>
      {cart.items.map((item, index) => (
        <div key={index} className={classes.body}>
          <div className={classes.image} data-name="Image">
            <Image
              src={item.image[0].url}
              height="90"
              width="90"
              priority={false}
              alt={item.name}
            />
          </div>
          <div data-name="Name">
            {item.name}
            {item.color.name && <span>Color: {item.color.name}</span>}
            {item.attribute.name && (
              <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
            )}
          </div>
          <div data-name="Price">
            {settings.settingsData.currency.symbol}&nbsp;
            {item.price}
          </div>
          <div data-name="Quantity">{item.qty}</div>
          <div className={classes.buttons} data-name="Actions">
            <button onClick={() => increaseQty(item.uid)}>+</button>
            <button onClick={() => decreaseQty(item.uid)}>-</button>
            <button onClick={() => dispatch(removeFromCart(item.uid))}>
              x
            </button>
          </div>
          <div data-name="Total Price">
            {settings.settingsData.currency.symbol}&nbsp;
            {decimalBalance(item.qty * item.price)}
          </div>
        </div>
      ))}
      <div className={classes.card_container}>
        <div className={classes.card}>
          <p>Delivery</p>
          <b>{settings.settingsData.currency.symbol}&nbsp;0</b>
        </div>
        <div className={classes.card}>
          <p>Sub Total</p>
          <b>
            {settings.settingsData.currency.symbol}&nbsp;
            {getTotalPrice}
          </b>
        </div>
        <div className={classes.card}>
          <p>Discount</p>
          <b>
            {settings.settingsData.currency.symbol}&nbsp;
            {decimalBalance(getTotalPrice - discountPrice)+finalDiscount}
          </b>
        </div>
        
        <div className={classes.card}>
          <p>GST</p>
          <b>
            {settings.settingsData.currency.symbol}&nbsp;
            {getTotalGST}
          </b>
        </div>
        
        
        
        <div className={classes.card}>
          <p>Total (Incl. GST)</p>
          <b>
            {settings.settingsData.currency.symbol}&nbsp;
            {discountPrice}
          </b>
        </div>
      </div>
      <div className={classes.checkout_container}>
        <div className={classes.coupon}>
          <input
            type="text"
            ref={couponCode}
            defaultValue={cart.coupon.code}
            placeholder="Please enter promo code"
          />
          <button onClick={checkCoupon}>Apply Discount</button>
        </div>
        <div className={classes.checkout}>
          <button onClick={checkoutProcess}>Order Now</button>
          <Link href="/gallery" passHref>
            <button>Back to shopping</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
