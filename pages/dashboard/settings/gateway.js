import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const SettingsPageGateway = () => {
  const url = `/api/settings`;
  const { data, error, mutate } = useSWR(url, fetchData);
  const [settings, setSettings] = useState([]);
  const [buttonState, setButtonState] = useState("");
  useEffect(() => {
    if (data && data.settings) {
      setSettings(data.settings);
    }
  }, [data]);

  const cod = useRef();
  const paypal = useRef();
  const stripe = useRef();
  const sslCommerz = useRef();
  const razorpay = useRef();

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "settings"));
  }, [session]);

  const handleForm = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    try {
      const data = JSON.stringify({
        cod: cod.current.checked,
        paypal: paypal.current.checked,
        stripe: stripe.current.checked,
        sslCommerz: sslCommerz.current.checked,
        razorpay: razorpay.current.checked,
      });
      const formData = new FormData();
      formData.append("gateway", data);
      const response = await postData(`/api/settings?scope=gateway`, formData);
      response.success
        ? toast.success("Setting Updated Successfully")
        : toast.error(`Something Went Wrong (500)`);
      setButtonState("");
    } catch (err) {
      toast.error(`Something Went Wrong (${err.message})`);
    }
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !settings._id ? (
        <Spinner />
      ) : (
        <form onSubmit={handleForm}>
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              Payment Gateway Settings
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-xl-4 col-lg-6">
                  <div className="card mb-5 border-0 shadow">
                    <div className="card-header bg-white py-3 text-center fw-bold">
                      Cash On Delivery Payment Activation
                    </div>
                    <div className="card-body">
                      <div className="float-start">
                        <Image
                          src="/images/cash-on-del-logo.png"
                          width="100"
                          height="50"
                          alt="COD"
                        />
                      </div>
                      <div className="form-check form-switch my-3 float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inp-110"
                          ref={cod}
                          defaultChecked={settings.paymentGateway.cod}
                        />
                        <label className="form-check-label" htmlFor="inp-110">
                          Status
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="card mb-5 border-0 shadow">
                    <div className="card-header bg-white py-3 text-center fw-bold">
                      Paypal Payment Activation
                    </div>
                    <div className="card-body">
                      <div className="float-start">
                        <Image
                          src="/images/paypal-logo.png"
                          width="100"
                          height="50"
                          alt="Paypal"
                        />
                      </div>
                      <div className="form-check form-switch my-3 float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inp-111"
                          ref={paypal}
                          defaultChecked={settings.paymentGateway.paypal}
                        />
                        <label className="form-check-label" htmlFor="inp-111">
                          Status
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="card mb-5 border-0 shadow">
                    <div className="card-header bg-white py-3 text-center fw-bold">
                      Stripe Payment Activation
                    </div>
                    <div className="card-body">
                      <div className="float-start">
                        <Image
                          src="/images/stripe-logo.png"
                          width="100"
                          height="50"
                          alt="Stripe"
                        />
                      </div>
                      <div className="form-check form-switch my-3 float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inp-112"
                          ref={stripe}
                          defaultChecked={settings.paymentGateway.stripe}
                        />
                        <label className="form-check-label" htmlFor="inp-112">
                          Status
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="card mb-5 border-0 shadow">
                    <div className="card-header bg-white py-3 text-center fw-bold">
                      Sslcommerz Payment Activation
                    </div>
                    <div className="card-body">
                      <div className="float-start">
                        <Image
                          src="/images/ssl-logo.png"
                          width="100"
                          height="50"
                          alt="Sslcommerz"
                        />
                      </div>
                      <div className="form-check form-switch my-3 float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inp-113"
                          ref={sslCommerz}
                          defaultChecked={settings.paymentGateway.sslCommerz}
                        />
                        <label className="form-check-label" htmlFor="inp-113">
                          Status
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="card mb-5 border-0 shadow">
                    <div className="card-header bg-white py-3 text-center fw-bold">
                      Razorpay Payment Activation
                    </div>
                    <div className="card-body">
                      <div className="float-start">
                        <Image
                          src="/images/razorpay-logo.png"
                          width="100"
                          height="50"
                          alt="Razorpay"
                        />
                      </div>
                      <div className="form-check form-switch my-3 float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inp-113"
                          ref={razorpay}
                          defaultChecked={settings.paymentGateway.razorpay}
                        />
                        <label className="form-check-label" htmlFor="inp-113">
                          Status
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {permissions.edit && (
            <div className="py-3">
              <LoadingButton type="submit" text="Update" state={buttonState} />
            </div>
          )}
        </form>
      )}
    </>
  );
};

SettingsPageGateway.requireAuthAdmin = true;
SettingsPageGateway.dashboard = true;

export default SettingsPageGateway;
