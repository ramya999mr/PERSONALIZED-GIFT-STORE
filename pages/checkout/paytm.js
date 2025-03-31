import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "~/components/Ui/Spinner";
import { postData } from "~/lib/clientFunctions";
import { resetCart } from "~/redux/cart.slice";
import classes from "~/styles/payment.module.css";

export default function Stripe() {
  const [loading, setLoading] = useState(false);
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const exchangeRate = Number(settings.settingsData.currency.exchangeRate);
  const dispatch = useDispatch();
  const router = useRouter();
  const processOrder = async (id) => {
    try {
      const { coupon, items, billingInfo, shippingInfo, deliveryInfo } =
        cartData;
      const data = {
        coupon,
        products: items,
        billingInfo,
        shippingInfo,
        deliveryInfo,
        paymentData: {
          method: "Razorpay",
          id,
        },
      };
      const url = `/api/order/new`;
      const formData = new FormData();
      formData.append("checkoutData", JSON.stringify(data));
      const responseData = await postData(url, formData);
      if (responseData && responseData.success) {
        dispatch(resetCart());
        toast.success("Order successfully placed");
        setTimeout(() => {
          router.push(`/checkout/success/${responseData.createdOrder._id}`);
        }, 2000);
      } else {
        toast.error("Something Went Wrong (500)");
      }
    } catch (err) {
      toast.error(`Something Went Wrong ${err.message}`);
      console.log(err);
    }
  };

  const loadPaytm = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      const host = "https://securegw-stage.paytm.in";
      script.src = `${host}/merchantpgpui/checkoutjs/merchants/{MID}.js`;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createPayment = async () => {
    if (cartData.items.length === 0) {
      toast.error(
        "Illegal request, please add items to the card then make the payment"
      );
      return;
    }
    setLoading(true);
    const res = await loadPaytm();
    setLoading(false);
    if (!res) {
      toast.error("Paytm SDK Failed to load");
      return;
    }

    const data = await postData(`/api/checkout/paytm`, {
      cartData,
      exchangeRate,
    });

    var config = {
      root: "",
      flow: "DEFAULT",
      data: {
        orderId: data.orderId,
        token: data.token,
        tokenType: "TXN_TOKEN",
        amount: data.amount,
      },
      handler: {
        notifyMerchant: function (eventName, data) {
          console.log("notifyMerchant handler function called");
          console.log("eventName => ", eventName);
          console.log("data => ", data);
        },
      },
    };
    if (window.Paytm && window.Paytm.CheckoutJS) {
      // initialze configuration using init method
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          // after successfully updating configuration, invoke JS Checkout
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log("error => ", error);
        });
    }
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <div className="layout_top">
        <div className="App text-center">
          {loading && (
            <div style={{ height: "70vh" }}>
              <Spinner />
            </div>
          )}
          {!loading && (
            <div className={classes.container}>
              <h2 className={classes.h2}>Pay Now</h2>
              <button
                className="btn btn-primary fw-bold"
                onClick={createPayment}
              >
                Pay with Paytm
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Stripe.footer = false;
