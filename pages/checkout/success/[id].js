import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import classes from "~/components/Checkout/checkout.module.css";
import { fetchData } from "~/lib/clientFunctions";

const CheckoutNav = dynamic(() => import("~/components/Checkout/checkoutNav"));
const Invoice = dynamic(() => import("~/components/Invoice"));
const InvoicePrint = dynamic(() => import("~/components/Invoice/print"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const Error500 = dynamic(() => import("~/components/error/500"));
const Error404 = dynamic(() => import("~/components/error/404"));

const OrderSuccessPage = () => {
  const [orderData, setOrderData] = useState({});
  const [printInv, setPrintInv] = useState(false);
  const invoiceRef = useRef(null);
  const router = useRouter();
  const url = `/api/home/order?id=${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);

  useEffect(() => {
    if (data && data.order) {
      setOrderData(data.order);
    }
  }, [data]);

  async function printDoc(params) {
    setPrintInv(true);
    const { printDocument } = await import("~/lib/clientFunctions");
    await printDocument(invoiceRef.current, `Invoice #${orderData.orderId}`);
    setPrintInv(false);
  }

  return (
    <>
      {error ? (
        <Error500 />
      ) : !data ? (
        <div style={{ height: "100vh" }}>
          <Spinner />
        </div>
      ) : !orderData.orderId ? (
        <Error404 />
      ) : (
        <div className={classes.top}>
          <CheckoutNav tab={6} />
          <div className={classes.card}>
            <Invoice data={orderData} />
            <div className="py-2">
              <div className="row">
                <div className="col-md-6">
                  <button className="mt-3" onClick={printDoc}>
                    Download Invoice
                  </button>
                </div>
                <div className="col-md-6">
                  <Link href="/gallery" passHref>
                    <button className="mt-3">Continue Shopping</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {printInv && (
            <div
              ref={invoiceRef}
              style={{
                width: "800px",
                minHeight: "max-content",
              }}
            >
              <InvoicePrint data={orderData} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OrderSuccessPage;
