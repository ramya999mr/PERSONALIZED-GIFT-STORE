import React, { useState } from "react";
import Image from "next/image";
import classes from "./checkout.module.css";

const PaymentGatewayList = ({ selectPaymentMethod, submitOrder, settings }) => {
  const [loading, setLoading] = useState(false);

  const handleCompleteOrder = async () => {
    setLoading(true);

    // Perform the necessary asynchronous actions (e.g., submitting the order)
    try {
      await submitOrder();
      // After successful completion, you may redirect or perform other actions
    } catch (error) {
      console.error("Error submitting order:", error);
      // Handle error if necessary
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h6>Select a payment method :</h6>
      <div className={classes.payment_list}>
        {settings.cod && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="cod"
              defaultChecked
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <Image
                src="/images/cash-on-del-logo.png"
                width="100"
                height="50"
                alt="Cash On Delivery"
              />
              <span>Cash On Delivery</span>
            </div>
          </label>
        )}
        {settings.paypal && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="paypal"
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <Image
                src="/images/paypal-logo.png"
                width="100"
                height="50"
                alt="Paypal"
              />
              <span>Paypal</span>
            </div>
          </label>
        )}
        {settings.stripe && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="stripe"
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <Image
                src="/images/stripe-logo.png"
                width="100"
                height="50"
                alt="Stripe"
              />
              <span>Stripe</span>
            </div>
          </label>
        )}
        {settings.sslCommerz && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="sslcommerz"
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <Image
                src="/images/ssl-logo.png"
                width="100"
                height="50"
                alt="Sslcommerz"
              />
              <span>Sslcommerz</span>
            </div>
          </label>
        )}
        {settings.razorpay && (
          <label className={classes.payment_card_label}>
            <input
              type="radio"
              name="payment_method"
              value="razorpay"
              onChange={selectPaymentMethod}
            />
            <div className={classes.payment_card}>
              <Image
                src="/images/razorpay-logo.png"
                width="100"
                height="50"
                alt="Razorpay"
              />
              <span>Razorpay</span>
            </div>
          </label>
        )}
        <button className="my-3" onClick={handleCompleteOrder} disabled={loading}>
        {loading ? "Completing Order..." : "Complete Order"}
        </button>
      </div>
    </div>
  );
};

export default PaymentGatewayList;
