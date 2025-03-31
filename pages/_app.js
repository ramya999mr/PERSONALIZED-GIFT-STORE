import { Provider as AuthProvider } from "next-auth/client";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Appearance from "~/components/Appearance";
import CheckAuth from "~/components/Auth/authCheck";
import CookieContest from "~/components/cookieContest";
import GlobalLayout from "~/components/Layout/GlobalLayout";
import Preloader from "~/components/Ui/Preloader";
import { fetchData } from "~/lib/clientFunctions";
import "~/public/css/bootstrap.min.css";
import { updateCart } from "~/redux/cart.slice";
import { updateSettings } from "~/redux/settings.slice";
import { wrapper } from "~/redux/store";
import "~/styles/globals.css";
import { getStorageData } from "~/utils/useLocalStorage";

const NextNProgress = dynamic(() => import("nextjs-progressbar"), {
  ssr: false,
});

const ThirdPartyScript = dynamic(() => import("~/components/ThirdParty"));

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  async function loadSettings() {
    try {
      const response = await fetchData(`/api/home/settings`);
      if (!response.settings) {
        stopLoader();
      }
      dispatch(updateSettings(response.settings));
    } catch (err) {
      console.log(err);
    }
  }

  function stopLoader() {
    setTimeout(() => {
      setLoading(false);
    }, 150);
  }

  useEffect(() => {
    if (
      settings &&
      settings.settingsData &&
      settings.settingsData._id === null
    ) {
      loadSettings();
    } else {
      stopLoader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    async function updateStoreData() {
      dispatch(updateCart(await getStorageData("CART")));
    }
    updateStoreData();
    return () => {
      dispatch(updateCart([]));
    };
  }, [dispatch]);

  return (
    <AuthProvider session={pageProps.session}>
      {loading && <Preloader />}
      <ThirdPartyScript />
      <Script src="/js/jquery.min.js" />
      <Script src="/js/bootstrap.bundle.min.js" />
      <NextNProgress color="var(--main)" options={{ showSpinner: false }} />
      <Appearance />
      <CookieContest />
      <CheckAuth
        auth={Component.requireAuth}
        authAdmin={Component.requireAuthAdmin}
      >
        <GlobalLayout
          dashboard={Component.dashboard}
          footer={Component.footer}
          error={Component.hasError}
        >
          <Component {...pageProps} />
        </GlobalLayout>
      </CheckAuth>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
        transition={Flip}
      />
    </AuthProvider>
  );
}

export default wrapper.withRedux(MyApp);
