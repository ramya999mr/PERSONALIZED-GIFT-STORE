import { XLg } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { dateFormat, postData } from "~/lib/clientFunctions";
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "~/styles/orderTrack.module.css";
import LoadingButton from "../Ui/Button";
import StarRating from "../Ui/Rating/ratingInput";
import cls from "./purchaseDetails.module.css";

export default function PurchaseDetails({ data, hide, update }) {
  const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
  const Invoice = dynamic(() => import("~/components/Invoice"));
  const InvoicePrint = dynamic(() => import("~/components/Invoice/print"));
  const [printInv, setPrintInv] = useState(false);
  const invoiceRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    name: null,
    oid: null,
  });
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const product_review = (id, name, oid) => {
    setSelectedProduct({ id, name, oid });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  async function printDoc(params) {
    setPrintInv(true);
    const { printDocument } = await import("~/lib/clientFunctions");
    await printDocument(invoiceRef.current, `Invoice #${data.invoiceId}`);
    setPrintInv(false);
  }

  function gst(data) {
    var Percentage = (data.gst_amount / data.price) * 100;
    return Percentage.toFixed(0);
  }

  var finalDiscount = 0;
  var orginalTotal=0;
  for (const productData of data.products) {
    finalDiscount += productData.original_price - productData.price;
    finalDiscount = decimalBalance(finalDiscount * productData.qty);
    orginalTotal+=productData.original_price;
  }




  return (
    <>
      <div className={`${cls.card} border-0 shadow`}>
        <div className={cls.close} onClick={hide}>
          <XLg width={17} height={17} />
        </div>
        <div className="card border-0" ref={invoiceRef}>
          <div className="card-header bg-white py-3 fw-bold">Order Details</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <h6>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Address
                </h6>
                <p>
                  OPP DSP OFFICE, CHINNA BARATAM STREET
                  <br /> SRIKAKULAM, 532001
                  <br /> ANDHRA PRADESH
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
                <h6>Order no# {data.orderId}</h6>
              </div>

              <div className="col-md-4">
                <h6>
                  <FontAwesomeIcon icon={faEnvelope} /> Contact Information
                </h6>
                <p>
                  <strong>Email:</strong> info@printmine.com
                </p>
                <p>
                  <strong>Phone:</strong> +91 9885821666
                </p>
              </div>
            </div>

            <div className={classes.body}>
              <div className={`${classes.order_details} row`}>
                <div className="col-md-4">
                  <h6>Order Details :</h6>
                  <p>
                  Invoice No : <span>{data.invoiceId}</span>
                </p>
                  <p>
                    Transaction Id : <span>{data.paymentId}</span>
                  </p>
                  
                  <p>
                    Order Id : <span>{data.orderId}</span>
                  </p>
                  <p>
                    GST Number: <span>37BPYPP6340E1ZC</span>
                  </p>
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
                    Payment Method : <span>{data.paymentMethod}</span>
                  </p>
                  <p>
                    Delivery Type : <span>{data.deliveryInfo.type}</span>
                  </p>
                  {data.deliveryInfo.area && (
                    <p>
                      Delivery Area : <span>{data.deliveryInfo.area}</span>
                    </p>
                  )}
                  <p>
                    Delivery Cost :{" "}
                    <span>{currencySymbol + " " + data.deliveryInfo.cost}</span>
                  </p>
                </div>

                <div className="col-md-4">
                  <h6>Billing Address :</h6>
                  <p>
                    Full Name : <span>{data.billingInfo.fullName}</span>
                  </p>
                  <p>
                    Phone : <span>{data.billingInfo.phone}</span>
                  </p>
                  <p>
                    Email : <span>{data.billingInfo.email}</span>
                  </p>
                  <p>
                    House : <span>{data.billingInfo.house}</span>
                  </p>
                  <p>
                    City : <span>{data.billingInfo.city}</span>
                  </p>
                  <p>
                    State : <span>{data.billingInfo.state}</span>
                  </p>
                  <p>
                    Zip Code : <span>{data.billingInfo.zipCode}</span>
                  </p>
                  <p>
                    Country : <span>{data.billingInfo.country}</span>
                  </p>
                </div>
                <div className="col-md-4">
                  <h6>Shipping Address :</h6>
                  <p>
                    Full Name: <span>{data.shippingInfo.fullName}</span>
                  </p>
                  <p>
                    Phone : <span>{data.shippingInfo.phone}</span>
                  </p>
                  <p>
                    Email : <span>{data.shippingInfo.email}</span>
                  </p>
                  <p>
                    House : <span>{data.shippingInfo.house}</span>
                  </p>
                  <p>
                    City : <span>{data.shippingInfo.city}</span>
                  </p>
                  <p>
                    State : <span>{data.shippingInfo.state}</span>
                  </p>
                  <p>
                    Zip Code : <span>{data.shippingInfo.zipCode}</span>
                  </p>
                  <p>
                    Country : <span>{data.shippingInfo.country}</span>
                  </p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Products</th>
                      <th scope="col">Quantity</th>
                      {/* <th scope="col">GST</th> */}
                      <th scope="col">Price</th>
                      <th scope="col">Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((product, idx) => (
                      <tr key={idx + product._id}>
                        <th scope="row">{idx + 1}</th>
                        <td>{product.name}</td>
                        <td>{product.qty}</td>
                        {/* <td>
                          {data.shippingInfo.state === "Andhr Pradesh" ? (
                            <>
                              <span>CGST:{gst(product) / 2}%</span>&nbsp;
                              <span>SGST:{gst(product) / 2}%</span>
                              <br />
                              <span>
                                CGST: Rs{" "}
                                {(product.qty * product.gst_amount) / 2}
                              </span>
                              <br />
                              <span>
                                SGST: Rs{" "}
                                {(product.qty * product.gst_amount) / 2}
                              </span>
                            </>
                          ) : (
                            <>
                              <span>GST:{gst(product)}%</span>
                              <br />
                              <span>
                                GST: Rs {product.qty * product.gst_amount}
                              </span>
                            </>
                          )}
                        </td> */}

                        <td>{currencySymbol + " " + product.price}</td>
                        <td>
                          {data.status === "Delivered" ? (
                            <button
                              className={cls.review_button}
                              onClick={() =>
                                product_review(
                                  product._id,
                                  product.name,
                                  data.orderId
                                )
                              }
                              disabled={product.review ? true : false}
                            >
                              {product.review ? "reviewed" : "Review"}
                            </button>
                          ) : (
                            "Not Delivered Yet"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={classes.payment_info}>

              
              <div>
                  <span>Original Value</span>
                  <span>{currencySymbol + " " + orginalTotal}</span>
                </div>

                <div>
                  <span>Discount</span>
                  <span>
                    {currencySymbol +
                      " -" +
                      decimalBalance(finalDiscount)}
                  </span>
                </div>
                <div>
                  <span>Taxable  Value</span>
                  <span>{currencySymbol + " " + decimalBalance(data.totalPrice-data.totalGST)}</span>
                </div>

            
                <div>
                <span>SGST</span>
                <span>
                  {currencySymbol + " " + Math.round(data.totalGST/2)}
                </span>
              </div>
              <div>
                <span>CGST</span>
                <span>
                  {currencySymbol + " " + Math.round(data.totalGST/2)}
                </span>
              </div>


                <div>
                  <span>Delivery Charge</span>
                  <span>{currencySymbol + " " + data.deliveryInfo.cost}</span>
                </div>
                <div>
                  <span>Total</span>
                  <span>{currencySymbol + " " + data.payAmount}</span>
                </div>

                <div className="py-2">
                  <div className="row">
                    <div className="col-md-12">
                      <button className="mt-3" onClick={printDoc}>
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
        <ReviewForm data={selectedProduct} />
      </GlobalModal>
    </>
  );

  function ReviewForm({ data }) {
    const [loading, setLoading] = useState("");
    const [rating, setRating] = useState(1);
    const comment = useRef();
    async function postReview(e) {
      try {
        e.preventDefault();
        setLoading("loading");
        const _data = {
          pid: data.id,
          oid: data.oid,
          rating,
          comment: comment.current.value.trim(),
        };
        const resp = await postData("/api/review", _data);
        resp.success
          ? (toast.success("Review Added Successfully"),
            hide(),
            closeModal(),
            update())
          : toast.error("Something Went Wrong 500");
      } catch (err) {
        console.log(err);
        toast.error(`Something Went Wrong - ${err.message}`);
      }
      setLoading("");
    }
    return (
      <form onSubmit={postReview}>
        <div className="mb-3">
          <label className="form-label">Product</label>
          <p>{data.name}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <StarRating rate={setRating} />
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea className="form-control" ref={comment} required></textarea>
        </div>
        <LoadingButton text="Submit Review" state={loading} type="submit" />
      </form>
    );
  }
}
