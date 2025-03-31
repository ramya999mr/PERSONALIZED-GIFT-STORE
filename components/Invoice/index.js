import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import classes from "~/components/Checkout/checkout.module.css";
import { dateFormat, decimalBalance, postData } from "~/lib/clientFunctions";
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Invoice = ({ data }) => {
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;

  function gst(data) {
    var Percentage = (data.gst_amount / data.price) * 100;
    return Percentage.toFixed(0);
  }

  var finalDiscount = 0;
  for (const productData of data.products) {
    finalDiscount += productData.original_price - productData.price;
    finalDiscount = decimalBalance(finalDiscount * productData.qty);
  }

  return (
    <div className={classes.confirmation}>
      <div className={classes.confirmation_heading}>
        {settings.settingsData.logo[0] && (
          <Image
            src={settings.settingsData.logo[0].url}
            width={166}
            height={60}
            alt={settings.settingsData.name}
          />
        )}
        <h6>OM SHIVA SHAKTI ENTERPRISES</h6>
        <h2>We have received your order</h2>
        <h6>Order no# {data.orderId}</h6>
        {/* <p>A copy of your receipt has been send to {data.billingInfo.email}</p> */}
        <br />

        <div className={`${classes.order_details} row`}>
          <div className="col-md-6 mx-auto">
            <p>
              Order Date : <span>{dateFormat(data.orderDate)}</span>
            </p>
            <p>
              Payment Status :{" "}
              {data.paymentStatus === "Unpaid" ? (
                <span className="badge bg-danger">Unpaid</span>
              ) : (
                <span className="badge bg-success">Paid</span>
              )}
            </p>
            <p>
              Order Status:{" "}
              <span className="badge bg-primary">{data.status}</span>
            </p>
            <p>
              Payment Method: <span>{data.paymentMethod}</span>
            </p>
            <p>
              GST Number: <span>37BPYPP6340E1ZC</span>
            </p>
          </div>
        </div>
      </div>
      <div className={classes.confirmation_body}>
        <h5>Delivery details</h5>
        <div className="row">
          <div className="col-md-6">
            <h6>Delivery for</h6>
            <p>{data.billingInfo.fullName}</p>
            <p>Phone no : {data.billingInfo.phone}</p>
            <br />
            <h6>Address</h6>
            <p>{`${data.billingInfo.house} ${data.billingInfo.state} ${data.billingInfo.zipCode} ${data.billingInfo.country}`}</p>
          </div>
          <div className="col-md-6">
            <h6>Delivery method</h6>
            <p>{data.deliveryInfo.type}</p>
            <br />
            <h6>Payment method</h6>
            <p>{data.paymentMethod}</p>
          </div>
        </div>
        <h5>Order summary</h5>
        <div className={classes.cart_item_list}>
          {data.products.map((item, index) => (
            <div className={classes.cart_item} key={index}>
              <div className={classes.cart_container}>
                <span className={classes.cart_disc}>
                  <b>{item.name}</b>
                  {item.color.name && <span>Color: {item.color.name}</span>}
                  {item.attribute.name && (
                    <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                  )}
                  <span>Qty: {item.qty}</span>
                  <span>
                    Price: {currencySymbol}&nbsp;
                    {item.price}
                  </span>
                  {data.shippingInfo.state === "Andhra Pradesh" ? (
                    <>
                      <span>CGST:&nbsp;{item.gst / 2}%</span>
                      <span>SGST:{item.gst / 2}%</span>
                    </>
                  ) : (
                    <span>GST:{item.gst}%</span>
                  )}
                  <span>
                    GST: {currencySymbol}&nbsp;
                    {item.gst_amount * item.qty}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className={classes.confirmation_pay}>
          <div>
            <span>Discount</span>
            <span>
              {currencySymbol}&nbsp; -{decimalBalance(finalDiscount)}
            </span>
          </div>
          <div>
            <span>After Discount Sub Total</span>
            <span>
              {currencySymbol}&nbsp;
              {decimalBalance(data.totalPrice)}
            </span>
          </div>

          <div>
            <span>GST</span>
            <span>
              {currencySymbol}&nbsp;
              {data.totalGST}
            </span>
          </div>
          <div>
            <span>Delivery Charge</span>
            <span>
              {currencySymbol}&nbsp;
              {data.deliveryInfo.cost}
            </span>
          </div>
          <div>
            <span>Total</span>
            <span>
              {currencySymbol}&nbsp;
              {decimalBalance(data.payAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h4>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Address
          </h4>
          <p>
            GROUND AND 1ST FLOUR,
            <br />
            11/9/24, KALINGA ROAD,
            <br />
            OLD BUSSTAND, Srikakulam
            <br /> Andhra Pradesh, 532001
          </p>
        </div>

        <div className="col-md-6">
          <h4>
            <FontAwesomeIcon icon={faEnvelope} /> Contact Information
          </h4>
          <p>
            <strong>Email:</strong> info@printmine.com
          </p>
          <p>
            <strong>Phone:</strong> <FontAwesomeIcon icon={faPhone} /> +91
            9885831666, 9441389299
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
