import { CardText, ChatLeftDots, StarHalf } from "@styled-icons/bootstrap";
import customId from "custom-id-new";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import Error404 from "~/components/error/404";
import Error500 from "~/components/error/500";
import HeadData from "~/components/Head";
import Product from "~/components/Product/product";
import classes from "~/components/Product/productDetails.module.css";
import Question from "~/components/question";
import Review from "~/components/Review";
import {
  appUrl,
  fetchData,
  postData,
  setSettingsData,
} from "~/lib/clientFunctions";
import { addToCart, addVariableProductToCart } from "~/redux/cart.slice";
import { wrapper } from "~/redux/store";

const Carousel = dynamic(() =>
  import("react-responsive-carousel").then((com) => com.Carousel),
);

function ProductDetailsPage({ data, error }) {
  const [selectedColor, setSelectedColor] = useState({
    name: null,
    value: null,
  });
  const [selectedAttribute, setSelectedAttribute] = useState({
    name: null,
    value: null,
    for: null,
  });
  const { session } = useSelector((state) => state.localSession);
  const [price, setPrice] = useState(0);
  const [tabId, setTabId] = useState(1);
  const dispatch = useDispatch();
  const quantityAmount = useRef();
  const question = useRef();
  const cartData = useSelector((state) => state.cart);
  const router = useRouter();
  const relatedItem =
    data.related &&
    data.related.filter((obj) => {
      return obj._id !== data.product._id;
    });

  useEffect(() => {
    if (data && data.product) {
      setPrice(data.product.discount);
    }
  }, [data]);

  const checkVariantInfo = (color, attr) => {
    const colorName = color || selectedColor.name;
    const attrName = attr || selectedAttribute.name;
    return data.product.variants.find(
      (item) => item.color === colorName && item.attr === attrName,
    );
  };

  const stepUpQty = () => {
    quantityAmount.current.stepUp();
  };

  const stepDownQty = () => {
    quantityAmount.current.stepDown();
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
        image,
        price: Number(price),
        qty,
        original_price:data.product.price,
        quantity,
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
      const { _id, name, image, colors, gst_amount, attributes } = data.product;
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
          	gst_amount: gst_amount || 0,
            image,
            original_price:data.product.price,
            price: Number(price),
            qty,
            quantity: Number(variantData.qty),
            sku: variantData.sku,
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

  const _showTab = (i) => {
    setTabId(i);
  };

  const refreshData = () => router.replace(router.asPath);

  async function postQuestion(e) {
    try {
      e.preventDefault();
      const _data = {
        pid: data.product._id,
        question: question.current.value.trim(),
      };
      const _r = await postData("/api/question", _data);
      _r.success
        ? (toast.success("Question Added Successfully"), refreshData())
        : toast.error("Something Went Wrong 500");
    } catch (err) {
      console.log(err);
      toast.error(`Something Went Wrong - ${err.message}`);
    }
  }

  if (error) return <Error500 />;
  if (!data.product) return <Error404 />;

  return (
    <>
      <HeadData
        title={data.product.name}
        seo={data.product.seo}
        url={`product/${data.product.slug}`}
      />
      <div className="py-5 mt-5">
        <div className="custom_container">
          <div className="mt-5 px-2 py-3">
            <div className={classes.container}>
              <div className="row m-0">
                <div className="col-lg-6 p-0">
                  <div className={classes.slider}>
                    <div className={classes.image_container_main}>
                      <Carousel
                        showArrows={false}
                        showThumbs={true}
                        showIndicators={false}
                        renderThumbs={thumbs}
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
                      {data.product.salePrice > 0 && (
                        <p className={classes.price_ori}>
                          ${data.product.price}
                        </p>
                      )}
                      <p className={classes.price}>Rs {price}</p>
                      <strike>Rs.{data.product.price}</strike>
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
                                  <label
                                    style={{ backgroundColor: color.value }}
                                  />
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
                        <button
                          onClick={stepUpQty}
                          className={classes.plus}
                        ></button>
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
            <div className={classes.tab_button}>
              <button
                onClick={() => _showTab(1)}
                className={tabId === 1 ? classes.active : classes.not}
              >
                Descriptions
              </button>
              <button
                onClick={() => _showTab(2)}
                className={tabId === 2 ? classes.active : classes.not}
              >
                Review ({data.product.review.length})
              </button>
              <button
                onClick={() => _showTab(3)}
                className={tabId === 3 ? classes.active : classes.not}
              >
                Questions ({data.product.question.length})
              </button>
            </div>
            <div className={classes.details_card}>
              {tabId === 1 && (
                <>
                  {data.product.description &&
                  data.product.description.length > 0 ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.product.description,
                      }}
                    />
                  ) : (
                    <EmptyContent
                      icon={<CardText width={40} height={40} />}
                      text="This product has no description"
                    />
                  )}
                </>
              )}
              {tabId === 2 && (
                <>
                  {data.product.review && data.product.review.length > 0 ? (
                    <Review review={data.product.review} />
                  ) : (
                    <EmptyContent
                      icon={<StarHalf width={40} height={40} />}
                      text="This product has no reviews yet"
                    />
                  )}
                </>
              )}
              {tabId === 3 && (
                <>
                  {session && (
                    <form
                      className="border border-2 rounded p-3 mb-3"
                      onSubmit={postQuestion}
                    >
                      <div className="mb-3">
                        <label className="form-label">Ask a question</label>
                        <textarea
                          className="form-control"
                          maxLength={300}
                          placeholder="Maximum 300 words"
                          ref={question}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className={classes.c_btn}>
                        ASK QUESTION
                      </button>
                    </form>
                  )}
                  {data.product.question && data.product.question.length > 0 ? (
                    <Question
                      qtn={data.product.question}
                      user={session}
                      pid={data.product._id}
                      refresh={refreshData}
                    />
                  ) : (
                    <EmptyContent
                      icon={<ChatLeftDots width={40} height={40} />}
                      text="There are no questions asked yet. Please login or register to ask question"
                    />
                  )}
                </>
              )}
            </div>
            {relatedItem.length > 0 && (
              <div className={classes.related}>
                <p className={classes.related_header}>Related Items</p>
                <ul className={classes.related_list}>
                  {relatedItem.map((product, index) => (
                    <Product key={index} product={product} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyContent({ icon, text }) {
  return (
    <div className={classes.empty_content}>
      <div className={classes.empty_icon}>{icon}</div>
      <div className={classes.empty_text}>{text}</div>
    </div>
  );
}

ProductDetailsPage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (ctx) => {
    try {
      const { origin } = appUrl(ctx.req);
      const url = `${origin}/api/product/${ctx.query.name}?relatedProduct=true`;
      const data = await fetchData(url);
      setSettingsData(store, data);
      return {
        data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: { product: null },
        error,
      };
    }
  },
);

export default ProductDetailsPage;
