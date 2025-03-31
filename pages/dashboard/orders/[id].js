import dynamic from "next/dynamic";
import DefaultErrorPage from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { dateFormat, fetchData } from "~/lib/clientFunctions";
import classes from "~/styles/orderDetails.module.css";

const InvoicePrint = dynamic(() => import("~/components/Invoice/print"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const ViewOrder = () => {
  const router = useRouter();
  const invoiceRef = useRef(null);
  const url = `/api/order/${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);

  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    if (data && data.order) {
      setOrderData(data.order);
    }
  }, [data]);

  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const printInvoice = async () => {
    const { printDocument } = await import("~/lib/clientFunctions");
    invoiceRef.current.style.display = "block";
    await printDocument(invoiceRef.current, `Invoice #${orderData.orderId}`);
    invoiceRef.current.style.display = "none";
  };

  return (
    <>
      {error ? (
        <DefaultErrorPage statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : !data.success ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div>
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h5 className="mb-0">Order Details</h5>
                <div>
                  <Link href="/dashboard/orders/" passHref>
                    <button className="btn btn-outline-primary btn-sm m-1">
                      Back
                    </button>
                  </Link>
                  <button
                    onClick={printInvoice}
                    className="btn btn-outline-primary btn-sm m-1"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            {orderData.orderId && (
              <div>
                <div className="row">
                  <div className="col-md-4">
                    <h6>Address</h6>
                    <p>
                      GROUND AND 1ST FLOUR,
                      <br />
                      11/9/24, KALINGA ROAD,
                      <br />
                      OLD BUSSTAND, Srikakulam
                      <br /> Andhra Pradesh, 532001
                    </p>
                  </div>
                  <div className="col-md-4 text-center">
                    {settings.settingsData.logo[0] && (
                      <Image
                        src={settings.settingsData.logo[0].url}
                        width={166}
                        height={60}
                        alt={settings.settingsData.name}
                      />
                    )}
                    <h6>OM SHIVA SHAKTI ENTERPRISES</h6>
                  </div>

                  <div className="col-md-4">
                    <h6> Contact Information</h6>
                    <p>
                      <strong>Email:</strong> info@printmine.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +91 9885831666, 9441389299
                    </p>
                  </div>
                </div>

                <div className={`${classes.order_details} row`}>
                  <div className="col-md-4">
                    <h6>Order Details :</h6>

                    <p>
                      Invoice No : <span>{orderData.invoiceId}</span>
                    </p>
                    <p>
                      Transaction Id : <span>{orderData.paymentId}</span>
                    </p>
                    <p>
                      Order Id : <span>{orderData.orderId}</span>
                    </p>
                    <p>
                      GST Number: <span>37BPYPP6340E1ZC</span>
                    </p>
                    <p>
                      Order Date :{" "}
                      <span>{dateFormat(orderData.orderDate)}</span>
                    </p>
                    <p>
                      Payment Status :{" "}
                      {orderData.paymentStatus === "Unpaid" ? (
                        <span className="badge bg-danger">Unpaid</span>
                      ) : (
                        <span className="badge bg-success">Paid</span>
                      )}
                    </p>
                    <p>
                      Order Status:{" "}
                      <span className="badge bg-primary">
                        {orderData.status}
                      </span>
                    </p>
                    <p>
                      Payment Method : <span>{orderData.paymentMethod}</span>
                    </p>
                    <p>
                      Applied Coupon:
                      <span>
                        {orderData.coupon.code
                          ? `${orderData.coupon.code} - ${orderData.coupon.discount}%`
                          : null}
                      </span>
                    </p>
                    <p>
                      Delivery Type : <span>{orderData.deliveryInfo.type}</span>
                    </p>
                    {orderData.deliveryInfo.area && (
                      <p>
                        Delivery Area :{" "}
                        <span>{orderData.deliveryInfo.area}</span>
                      </p>
                    )}
                    <p>
                      Delivery Cost :{" "}
                      <span>
                        {currencySymbol + " " + orderData.deliveryInfo.cost}
                      </span>
                    </p>
                  </div>

                  <div className="col-md-4">
                    <h6>Billing Address :</h6>
                    <p>
                      Full Name : <span>{orderData.billingInfo.fullName}</span>
                    </p>
                    <p>
                      Phone : <span>{orderData.billingInfo.phone}</span>
                    </p>
                    <p>
                      Email : <span>{orderData.billingInfo.email}</span>
                    </p>
                    <p>
                      House : <span>{orderData.billingInfo.house}</span>
                    </p>
                    <p>
                      City : <span>{orderData.billingInfo.city}</span>
                    </p>
                    <p>
                      State : <span>{orderData.billingInfo.state}</span>
                    </p>
                    <p>
                      Zip Code : <span>{orderData.billingInfo.zipCode}</span>
                    </p>
                    <p>
                      Country : <span>{orderData.billingInfo.country}</span>
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h6>Shipping Address :</h6>
                    <p>
                      Full Name: <span>{orderData.shippingInfo.fullName}</span>
                    </p>
                    <p>
                      Phone : <span>{orderData.shippingInfo.phone}</span>
                    </p>
                    <p>
                      Email : <span>{orderData.shippingInfo.email}</span>
                    </p>
                    <p>
                      House : <span>{orderData.shippingInfo.house}</span>
                    </p>
                    <p>
                      City : <span>{orderData.shippingInfo.city}</span>
                    </p>
                    <p>
                      State : <span>{orderData.shippingInfo.state}</span>
                    </p>
                    <p>
                      Zip Code : <span>{orderData.shippingInfo.zipCode}</span>
                    </p>
                    <p>
                      Country : <span>{orderData.shippingInfo.country}</span>
                    </p>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Products</th>
                        <th scope="col">Image</th>
                        <th scope="col">Sku</th>
                        <th scope="col">Color</th>
                        <th scope="col">Attribute</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.products.map((product, idx) => (
                        <tr key={idx}>
                          <th scope="row">{idx + 1}</th>
                          <td>{product.name}</td>
                          <td>
                            <Image
                              src={product.image[0].url}
                              width={50}
                              height={50}
                              alt={product.name}
                            />
                          </td>
                          <td>{product.sku}</td>
                          <td>
                            {product.color.name ? product.color.name : null}
                          </td>
                          <td>
                            {product.attribute.name
                              ? `${product.attribute.for} : ${product.attribute.name}`
                              : null}
                          </td>
                          <td>{product.qty}</td>
                          <td>{currencySymbol + " " + product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={classes.payment_info}>
                  <div>
                    <span>Discount</span>
                    <span>
                      {currencySymbol +
                        " " +
                        decimalBalance(
                          orderData.totalPrice - orderData.payAmount
                        )}
                    </span>
                  </div>

                  <div>
                    <span>After Discount Sub Total</span>
                    <span>{currencySymbol + " " + orderData.totalPrice}</span>
                  </div>

                  <div>
                    <span>GST</span>
                    <span>
                      {currencySymbol +
                        " " +
                        decimalBalance(orderData.totalGST)}
                    </span>
                  </div>
                  <div>
                    <span>Delivery Charge</span>
                    <span>
                      {currencySymbol + " " + orderData.deliveryInfo.cost}
                    </span>
                  </div>
                  <div>
                    <span>Total</span>
                    <span>
                      {currencySymbol +
                        " " +
                        decimalBalance(orderData.payAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div
              ref={invoiceRef}
              style={{
                display: "none",
                width: "800px",
                minHeight: "max-content",
              }}
            >
              {orderData.orderId && <InvoicePrint data={orderData} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ViewOrder.requireAuthAdmin = true;
ViewOrder.dashboard = true;

export default ViewOrder;
