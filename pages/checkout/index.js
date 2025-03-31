import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/Checkout/checkout.module.css";
import HeadData from "~/components/Head";
import data from "~/data";
import { fetchData, postData } from "~/lib/clientFunctions";
import { resetCart, updateBillingData } from "~/redux/cart.slice";

const CheckoutNav = dynamic(() => import("~/components/Checkout/checkoutNav"));
const PaymentGatewayList = dynamic(() =>
  import("~/components/Checkout/paymentGatewayList")
);

const Checkout = () => {
  const userData =
    useSelector((state) => state.localSession?.session?.user) ?? {};
  const [updatedUserData, setUpdatedUserData] = useState({});
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const dispatch = useDispatch();
  const router = useRouter();
  const { session } = useSelector((state) => state.localSession);
  const [visibleTab, setVisibleTab] = useState(1);
  const [sameShippingAddressValue, setSameShippingAddressValue] =
    useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [shippingChargeInfo, setShippingChargeInfo] = useState({});
  const [billingInfo, setBillingInfo] = useState({});
  const [shippingInfo, setShippingInfo] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const fullName1 = useRef();
  const phone1 = useRef();
  const email1 = useRef();
  const house1 = useRef();
  const city1 = useRef();
  const state1 = useRef();
  const zip1 = useRef();
  const country1 = useRef();
  const fullName2 = useRef();
  const phone2 = useRef();
  const email2 = useRef();
  const house2 = useRef();
  const city2 = useRef();
  const state2 = useRef();
  const zip2 = useRef();
  const country2 = useRef();
  const deliveryLocation = useRef();
  const deliveryArea = useRef();

  const url = `/api/profile?id=${userData.id}`;
  const userDetailsResponse = useSWR(userData.id ? url : null, fetchData);
 
  useEffect(() => {

    
    if (settings.settingsData.security.loginForPurchase && !session) {
      toast.info("Please Login To Continue");
      router.push("/signin");
    }else{
      const { data } = userDetailsResponse;
      if (data) {
          
          setUpdatedUserData(data.user)
      }
    }
    
    
  }, [settings, session, userDetailsResponse]);

  useEffect(() => {
    async function fetchShippingCharge() {
      try {
        const response = await fetchData(`/api/home/shipping`);
        response.success
          ? setShippingChargeInfo(response.shippingCharge)
          : console.log("something went wrong");
      } catch (err) {
        console.log(err);
      }
    }
    fetchShippingCharge();

    const deliveryData = {
      type: "Local Delivery",
      cost: 0,
      area: null,
    };
    setDeliveryInfo(deliveryData);
  }, []);

  const sameShippingAddress = (e) => {
    const isChecked = e.target.checked;
    setSameShippingAddressValue(isChecked);
  };

  const handleBillingInfo = (e) => {
    e.preventDefault();
    const billingAddressValue = {
      fullName: fullName1.current.value,
      phone: phone1.current.value,
      email: email1.current.value,
      house: house1.current.value,
      city: city1.current.value,
      state: state1.current.value,
      zipCode: zip1.current.value,
      country: country1.current.value,
    };
    setBillingInfo(billingAddressValue);
    sameShippingAddressValue
      ? (setShippingInfo(billingAddressValue), setVisibleTab(4))
      : setVisibleTab(3);
  };

  const handleShippingInfo = (e) => {
    e.preventDefault();
    const shippingAddressValue = {
      fullName: fullName2.current.value,
      phone: phone2.current.value,
      email: email2.current.value,
      house: house2.current.value,
      city: city2.current.value,
      state: state2.current.value,
      zipCode: zip2.current.value,
      country: country2.current.value,
    };
    setShippingInfo(shippingAddressValue);
    setVisibleTab(4);
  };

  const setDeliveryArea = () => {
    const area = deliveryArea.current.value;
    const areaInfo = shippingChargeInfo.area.filter((item) =>
      area.includes(item._id)
    );
    if (area.length > 0) {
      const deliveryData = {
        type: "Local Delivery",
        cost: areaInfo[0].price,
        area: areaInfo[0].name,
      };
      setDeliveryInfo(deliveryData);
    }
  };

  const processDeliveryInfo = () => {
    if (deliveryInfo.cost || deliveryInfo.area) {
      setVisibleTab(2);
    }
  };

  const selectPaymentMethodTab = () => {
    setVisibleTab(5);
    dispatch(updateBillingData({ billingInfo, shippingInfo, deliveryInfo }));
  };

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const getTotalPrice = decimalBalance(
    cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    )
  );

  const getTotalGst = decimalBalance(
    cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.gst_amount,
      0
    )
  );

  const orginalTotal = decimalBalance(
    cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.original_price,
      0
    )
  );

  
  const discountPrice = decimalBalance(
    getTotalPrice - (cartData.coupon.discount / 100) * getTotalPrice
  );

  const agreeTerms = () => setTermsAgree(!termsAgree);

  const selectPaymentMethod = (e) => setPaymentMethod(e.target.value);
  const submitOrder = async () => {
    try {
      if (paymentMethod === "cod") {
        const data = {
          coupon: cartData.coupon,
          products: cartData.items,
          billingInfo,
          shippingInfo,
          deliveryInfo,
          paymentData: {
            method: "Cash On Delivery",
            id: null,
          },
        };
        const url = `/api/order/new`;
        const formData = new FormData();
        formData.append("checkoutData", JSON.stringify(data));
        const response = await postData(url, formData);
        response && response.success
          ? (dispatch(resetCart()),
            toast.success("Order successfully placed"),
            router.push(`/checkout/success/${response.createdOrder._id}`))
          : toast.error("Something Went Wrong (500)");
      } else {
        router.push(`/checkout/${paymentMethod}`);
      }
    } catch (err) {
      toast.error(`Something Went Wrong ${err}`);
      console.log(err);
    }
  };

  var finalDiscount = 0;
  for (const productData of cartData.items) {
    finalDiscount += productData.original_price - productData.price;
    finalDiscount = decimalBalance(finalDiscount * productData.qty);
  }

  return (
    <>
      <HeadData title="Checkout" />
      <div className={classes.top}>
        <CheckoutNav tab={visibleTab} />
        <div className={classes.card}>
          {visibleTab === 1 && deliveryTypeJsx()}
          {visibleTab === 2 &&
            cartData &&
            cartData.items.length !== 0 &&
            billingInfoJsx()}
          {visibleTab === 3 && shippingInfoJsx()}
          {visibleTab === 4 && reviewJsx()}
          {visibleTab === 5 && (
            <PaymentGatewayList
              selectPaymentMethod={selectPaymentMethod}
              submitOrder={submitOrder}
              settings={settings.settingsData.paymentGateway}
            />
          )}
        </div>
      </div>
    </>
  );

  function reviewJsx() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className={classes.info}>
              <h6>Billing info :</h6>
              <span>Full Name: {billingInfo.fullName}</span>
              <span>Phone: {billingInfo.phone}</span>
              <span>Email: {billingInfo.email}</span>
              <span>House: {billingInfo.house}</span>
              <span>City: {billingInfo.city}</span>
              <span>State: {billingInfo.state}</span>
              <span>Zip Code: {billingInfo.zipCode}</span>
              <span>Country: {billingInfo.country}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className={classes.info}>
              <h6>Shipping info :</h6>
              <span>Full Name: {shippingInfo.fullName}</span>
              <span>Phone: {shippingInfo.phone}</span>
              <span>Email: {shippingInfo.email}</span>
              <span>House: {shippingInfo.house}</span>
              <span>City: {shippingInfo.city}</span>
              <span>State: {shippingInfo.state}</span>
              <span>Zip Code: {shippingInfo.zipCode}</span>
              <span>Country: {shippingInfo.country}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className={classes.info}>
              <h6>Delivery info :</h6>
              <span>Delivery Type: {deliveryInfo.type}</span>
              {deliveryInfo.area && (
                <span>Delivery Area: {deliveryInfo.area}</span>
              )}
              <span>
                Delivery Charges: {currencySymbol + " " + deliveryInfo.cost}
              </span>
            </div>
          </div>
        </div>
        <h6 className="mt-3">Items In Your Cart :</h6>
        <div className={classes.cart_item_list}>
          {cartData.items.map((item, index) => (
            <div className={classes.cart_item} key={index}>
              <div className={classes.cart_container}>
                <span className={classes.cart_image}>
                  <Image
                    src={item.image[0].url}
                    height="50"
                    width="50"
                    priority={false}
                    alt={item.name}
                  />
                </span>
                <span className={classes.cart_disc}>
                  <b>{item.name}</b>
                  {item.color.name && <span>Color: {item.color.name}</span>}
                  {item.attribute.name && (
                    <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                  )}
                  <span>Qty: {item.qty}</span>
                  <span>
                  {currencySymbol}&nbsp;<strike>{item.original_price}</strike>
                    <br/>
                    Price: {currencySymbol}&nbsp;
                    {item.price}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <h6 className="mt-3">Order Summary :</h6>
        <div className={classes.price_description}>
        <span>
            Orginal Price: {currencySymbol}&nbsp;
            {orginalTotal}
          </span>
        
          <span>
            Discount: {currencySymbol}&nbsp; -
            {decimalBalance(getTotalPrice - discountPrice) + finalDiscount}
          </span>
          <span>
            Taxable Value: {currencySymbol} &nbsp;
            {decimalBalance(getTotalPrice-getTotalGst)}
          </span>
          <span>Delivery: {currencySymbol + " " + deliveryInfo.cost}</span>

          <div>
            <span>SGST :</span>
            <span>
              {currencySymbol + " " + Math.round(getTotalGst / 2)}
            </span>
          </div>
          <div>
            <span>CGST :</span>
            <span>
              {currencySymbol + " " + Math.round(getTotalGst / 2)}
            </span>
          </div>

          <span>
            Total (Incl.GST): {currencySymbol}&nbsp;
            {decimalBalance(discountPrice+deliveryInfo.cost)}
          </span>
        </div>
        <div className={classes.terms}>
          <div className="py-2 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="Check2"
              onClick={agreeTerms}
            />
            <label className="form-check-label" htmlFor="Check2">
              I agree to the{" "}
              <a href="/terms" target="_blank">
                Terms and Conditions
              </a>
              ,{" "}
              <a href="/return" target="_blank">
                Return Policy
              </a>{" "}
              &{" "}
              <a href="/privacy" target="_blank">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
        <button
          className="mt-3"
          onClick={selectPaymentMethodTab}
          disabled={termsAgree ? false : true}
        >
          Continue
        </button>
      </div>
    );
  }

  function shippingInfoJsx() {
    return (
      <div>
        <form className={classes.checkout_form} onSubmit={handleShippingInfo}>
          <div className="mb-3">
            <label>Shipping Info</label>
            <div className={classes.input}>
              <input
                type="text"
                placeholder="Full Name*"
                ref={fullName2}
                required
                defaultValue={cartData.shippingInfo.fullName}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="tel"
                    placeholder="Phone*"
                    ref={phone2}
                    required
                    defaultValue={cartData.shippingInfo.phone}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="email"
                    placeholder="Email*"
                    ref={email2}
                    required
                    defaultValue={cartData.shippingInfo.email}
                  />
                </div>
              </div>
            </div>
            <div className={classes.input}>
              <textarea
                className="form-control"
                placeholder="House/Street*"
                ref={house2}
                required
                rows="2"
                defaultValue={cartData.shippingInfo.house}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder="City*"
                    ref={city2}
                    required
                    defaultValue={cartData.shippingInfo.city}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <select name="states" ref={state2}>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder="Post/Zip Code*"
                    ref={zip2}
                    required
                    defaultValue={cartData.shippingInfo.zipCode}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <select
                    className="form-control"
                    ref={country2}
                    required
                    defaultValue={cartData.shippingInfo.country}
                  >
                    <option value="">Select Country*</option>
                    {data.country.map((ct) => (
                      <option value={ct.name} key={ct.name}>
                        {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <button type="submit">Continue</button>
        </form>
      </div>
    );
  }

  function billingInfoJsx() {
    return (
      <div>
        <form className={classes.checkout_form} onSubmit={handleBillingInfo}>
          <div className="mb-3 col-9 mx-auto">
            <label>Billing Info</label>

            <div className="row">
              <div className="col-md-4">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder="Full Name*"
                    ref={fullName1}
                    required
                    defaultValue={
                      updatedUserData.name
                        ? updatedUserData.name
                        : cartData.billingInfo.fullName
                    }
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className={classes.input}>
                  <input
                    type="number"
                    placeholder="Phone*"
                    ref={phone1}
                    required
                    defaultValue={
                      updatedUserData.phone
                        ? updatedUserData.phone
                        : cartData.billingInfo.phone
                    }
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className={classes.input}>
                  <input
                    type="email"
                    placeholder="Email*"
                    ref={email1}
                    required
                    defaultValue={
                      updatedUserData.email
                        ? updatedUserData.email
                        : cartData.billingInfo.email
                    }
                  />
                </div>
              </div>
            </div>
            <div className={classes.input}>
              <textarea
                className="form-control"
                placeholder="House/Street*"
                ref={house1}
                required
                rows="2"
                defaultValue={
                  updatedUserData.house
                    ? updatedUserData.house
                    : cartData.billingInfo.house
                }
              />
            </div>

            <div className="row">
              <div className="col-md-3">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder="City*"
                    ref={city1}
                    required
                    defaultValue={
                      updatedUserData.city
                        ? updatedUserData.city
                        : cartData.billingInfo.city
                    }
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className={classes.input}>
                  <select name="states" ref={state1} required>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className={classes.input}>
                  <input
                    type="number"
                    placeholder="Post/Zip Code*"
                    ref={zip1}
                    required
                    defaultValue={
                      updatedUserData.zipCode
                        ? updatedUserData.zipCode
                        : cartData.billingInfo.zipCode
                    }
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className={classes.input}>
                  <select
                    className="form-control"
                    ref={country1}
                    required
                    defaultValue={cartData.billingInfo.country}
                  >
                    <option value="">Select Country*</option>
                    {data.country.map((ct) => (
                      <option value={ct.name} key={ct.name}>
                        {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="py-2 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="Check1"
                onClick={sameShippingAddress}
              />
              <label className="form-check-label" htmlFor="Check1">
                Shipping address same as billing address
              </label>
            </div>
            <button type="submit">Continue</button>
          </div>
        </form>
      </div>
    );
  }

  function deliveryTypeJsx() {
    return (
      <div>
        <div className="mb-3 col-4 mx-auto">
          <div className={classes.input}>
            {deliveryInfo.type && deliveryInfo.type === "Local Delivery" && (
              <div>
                <label>Select Delivery Area*</label>
                <select
                  className="form-control mb-3"
                  defaultValue=""
                  onChange={setDeliveryArea}
                  ref={deliveryArea}
                >
                  <option value="" disabled>
                    Select Delivery Area*
                  </option>
                  {shippingChargeInfo &&
                    shippingChargeInfo.area &&
                    shippingChargeInfo.area.length > 0 &&
                    shippingChargeInfo.area.map((ct, idx) => (
                      <option value={ct._id} key={idx}>
                        {ct.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
          <button
            onClick={processDeliveryInfo}
            disabled={deliveryInfo.cost || deliveryInfo.area ? false : true}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }
};

export default Checkout;
