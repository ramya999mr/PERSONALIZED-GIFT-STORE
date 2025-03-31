import customId from "custom-id-new";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData } from "~/lib/clientFunctions";
import { addToCart, addVariableProductToCart } from "~/redux/cart.slice";
import Spinner from "../Ui/Spinner";
import classes from "./productDetails.module.css";

const Carousel = dynamic(() =>
  import("react-responsive-carousel").then((com) => com.Carousel),
);

const ProductDetails = (props) => {
  const url = `/api/product/${props.productSlug}`;
  const { data, error } = useSWR(url, fetchData);
  const [selectedColor, setSelectedColor] = useState({
    name: null,
    value: null,
  });
  const [selectedAttribute, setSelectedAttribute] = useState({
    name: null,
    value: null,
    for: null,
  });
  const [price, setPrice] = useState(0);
  const dispatch = useDispatch();
  const quantityAmount = useRef();
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    if (data && data.product) {
      setPrice(data.product.discount);
    }
  }, [data]);

  if (error) return <div>failed to load</div>;
  if (!data) return <Spinner />;
  if (!data.product) return <div>Something Went Wrong...</div>;

  const stepUpQty = () => {
    quantityAmount.current.stepUp();
  };

  const stepDownQty = () => {
    quantityAmount.current.stepDown();
  };

  const checkVariantInfo = (color_name, attr_name) => {
    const colorName = color_name || selectedColor.name;
    const attrName = attr_name || selectedAttribute.name;
    return data.product.variants.find(
      (item) => item.color === colorName && item.attr === attrName,
    );
  };

  const changeColor = (e) => {
    try {
      const value = {
        name: e.target.getAttribute("data-color"),
        value: e.target.value,
      };
      setSelectedColor(value);
      const variantData = checkVariantInfo(value.name, null);
      if (variantData && variantData.price) {
        const itemPrice = data.product.discount + Number(variantData.price);
        setPrice(itemPrice);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeVariant = (e) => {
    try {
      const value = {
        name: e.target[e.target.selectedIndex].getAttribute("data-attr"),
        value: e.target.value,
        for: e.target[e.target.selectedIndex].getAttribute("data-tref"),
      };
      setSelectedAttribute(value);
      const variantData = checkVariantInfo(null, value.name);
      if (variantData && variantData.price) {
        const itemPrice = data.product.discount + Number(variantData.price);
        setPrice(itemPrice);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function stockInfo() {
    if (data.product.type === "simple") {
      return data.product.quantity > 0 ? true : false;
    }
    const qty = data.product.variants.reduce((a, b) => +a + +b.qty, 0);
    return qty > 0 ? true : false;
  }

  const simpleProductCart = (qty) => {
    const { _id, name, image, quantity, gst_amount, discount } = data.product;
    const existed = cartData.items.find((item) => item._id === _id);
    const totalQty = existed ? existed.qty + qty : qty;
    if (quantity >= totalQty) {
      const cartItem = {
        _id,
        uid: customId({ randomLength: 6 }),
        name,
        gst:data.product.gst,
        image,
        price: Number(price),
        original_price:data.product.price,
        qty,
        quantity,
        discount:Number(discount),
        color: { name: null, value: null },
        attribute: { name: null, value: null, for: null },
        gst_amount: gst_amount || 0
      };
      dispatch(addToCart(cartItem));
      toast.success("Added to Cart");
    } else {
      toast.error("This item is out of stock!");
    }
  };

  const checkQty = (prevQty, currentQty, availableQty) => {
    const avQty = Number(availableQty);
    if (avQty === -1) {
      return true;
    } else {
      return prevQty + currentQty <= avQty;
    }
  };

  const variableProductCart = (qty) => {
    try {
      const { _id, name, image, colors, attributes, gst_amount, quantity } = data.product;
      if (colors.length && !selectedColor.name) {
        toast.warning("Please Select Color!");
      } else if (attributes.length && !selectedAttribute.name) {
        toast.warning(`Please Select ${attributes[0].for}!`);
      } else {
        const existedProduct = cartData.items.find(
          (item) =>
            item._id === _id &&
            item.color.name == selectedColor.name &&
            item.attribute.name == selectedAttribute.name,
        );
        const existedQty = existedProduct ? existedProduct.qty : 0;
        const variantData = checkVariantInfo(
          selectedColor.name,
          selectedAttribute.name,
        );
        const qtyAvailable =
          variantData && checkQty(existedQty, qty, variantData.qty);
        if (qtyAvailable) {
          const cartItem = {
            _id,
            uid: customId({ randomLength: 6 }),
            name,
            image,
            price: Number(price),
            qty,
            discount:Number(discount),
            quantity: Number(variantData.qty),
            sku: variantData.sku,
            gst_amount: gst_amount || 0,
            color: selectedColor.name
              ? { name: selectedColor.name, value: selectedColor.value }
              : { name: null, value: null },
            attribute: selectedAttribute.name
              ? {
                  name: selectedAttribute.name,
                  value: selectedAttribute.value,
                  for: attributes[0].for,
                }
              : { name: null, value: null, for: null },
          };
          dispatch(addVariableProductToCart(cartItem));
          toast.success("Added to Cart");
        } else {
          toast.error("This item is out of stock!");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };

  const addItemToCart = () => {
    const qty = Number(quantityAmount.current.value);
    if (data.product.type === "simple") {
      simpleProductCart(qty);
    } else {
      variableProductCart(qty);
    }
  };

  const thumbs = () => {
    const thumbList = data.product.gallery.map((item, index) => (
      <Image
        key={item.name + index}
        src={item.url}
        alt={data.product.name}
        width={67}
        height={67}
      />
    ));
    return thumbList;
  };

  return (
    <div className={classes.container}>
      <div className="row">
        <div className="col-lg-6 p-0">
          <div className={classes.slider}>
            <div className={classes.image_container_main}>
              <Carousel
                showArrows={false}
                showThumbs={true}
                showIndicators={false}
                renderThumbs={thumbs}
                showStatus={false}
                emulateTouch={true}
                preventMovementUntilSwipeScrollTolerance={true}
                swipeScrollTolerance={50}
              >
                {data.product.gallery.map((item, index) => (
                  <InnerImageZoom
                    key={item.name + index}
                    src={item.url}
                    className={classes.magnifier_container}
                    fullscreenOnMobile={true}
                  />
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className="col-lg-6 p-0">
          <div className={classes.details}>
            <p className={classes.unit}>
            Stock : {data.product.quantity}
            </p>
            <h1 className={classes.heading}>{data.product.name}</h1>
            <hr />
            <div>
              {data.product.discount < data.product.price && (
                <p className={classes.price_ori}>
                  {settings.settingsData.currency.symbol}&nbsp;
                  {data.product.price}
                </p>
              )}
              <p className={classes.price}>
                {settings.settingsData.currency.symbol}&nbsp;
                {price}
              </p>
            </div>
            <p className={classes.description}>
              {data.product.shortDescription}
            </p>
            {data.product.type === "variable" && (
              <div>
                {data.product.colors.length > 0 && (
                  <div className={classes.color_selector}>
                    <p
                      className={classes.section_heading}
                      style={{ marginBottom: "11px" }}
                    >
                      Color
                    </p>
                    <div className={classes.color_selector_container}>
                      {data.product.colors.map((color, i) => (
                        <div className={classes.circle_outer} key={i}>
                          <input
                            type="radio"
                            name="color"
                            value={color.value}
                            data-color={color.label}
                            onClick={changeColor}
                            title={color.name}
                          />
                          <label style={{ backgroundColor: color.value }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.product.attributes.length > 0 && (
                  <div>
                    <p className={classes.section_heading}>
                      {data.product.attributes[0].for}
                    </p>
                    <div className={classes.select}>
                      <select onChange={changeVariant} defaultValue="">
                        <option value="" disabled>
                          Select {data.product.attributes[0].for}
                        </option>
                        {data.product.attributes.map((attr, i) => (
                          <option
                            key={i}
                            value={attr.value}
                            data-attr={attr.label}
                            data-tref={attr.for}
                          >
                            {attr.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className={classes.category}>
              <p className={classes.section_heading}>CATEGORIES</p>
              {data.product.categories.map((category, index) => (
                <span key={index} className={classes.category_list}>
                  {category}
                </span>
              ))}
            </div>
            <div className={classes.cart_section}>
              <p className={classes.section_heading}>QTY</p>
              <div className={classes.number_input}>
                <button
                  onClick={stepDownQty}
                  className={classes.minus}
                ></button>
                <input
                  className={classes.quantity}
                  ref={quantityAmount}
                  min="1"
                  max={data.product.quantity}
                  defaultValue="1"
                  type="number"
                  id="custom-number"
                  disabled
                />
                <button onClick={stepUpQty} className={classes.plus}></button>
              </div>
              <div className={classes.button_container}>
                {stockInfo() ? (
                  <button
                    className={classes.cart_button}
                    onClick={() => addItemToCart()}
                  >
                    ADD TO CART
                  </button>
                ) : (
                  <button className={classes.cart_button} disabled>
                    OUT OF STOCK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
