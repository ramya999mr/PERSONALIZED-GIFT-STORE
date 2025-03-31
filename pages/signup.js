import { getSession, signIn } from "next-auth/client";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Error500 from "~/components/error/500";
import HeadData from "~/components/Head";
import {
  appUrl,
  fetchData,
  postData,
  setSettingsData,
} from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
import classes from "~/styles/signin.module.css";
import Image from "next/image";

export default function SignUpPage({ srvError }) {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirm = useRef();

  const settings = useSelector((state) => state.settings);

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      if (password.current.value === passwordConfirm.current.value) {
        const data = new FormData();
        data.append("name", name.current.value);
        data.append("email", email.current.value);
        data.append("password", password.current.value);
        const response = await postData(`/api/auth/signup`, data);
        console.log(response);
        response.success
          ? (toast.success("New account added successfully"),
            document.querySelector("#signup_form").reset())
          : !response.success && response.duplicate
          ? toast.error("User with the given email is already exists")
          : toast.error("Something went Wrong");
      } else {
        toast.error("Both Password Field Value Not Matched");
        passwordConfirm.current.focus();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {srvError ? (
        <Error500 />
      ) : (
        <>
          <HeadData title="Register" />
          <div className={classes.container}>
            <div className={classes.card}>

            <div className="row mt-3">
                <div className="col-md-6">
                  <Image
                    src="/images/bgLogin.png"
                    width="330"
                    height="485"
                    alt="Login"
                  />
                </div>
                <div className="col-md-6">


              <h1>SIGN UP</h1>
              <form
                onSubmit={handleForm}
                id="signup_form"
                className={classes.form}
              >
                <input
                  type="text"
                  ref={name}
                  required
                  placeholder="Name*"
                  className="form-control"
                />
                <input
                  type="email"
                  ref={email}
                  required
                  placeholder="Email address*"
                  className="form-control"
                />
                <input
                  type="password"
                  ref={password}
                  required
                  placeholder="New Password*"
                  className="form-control"
                />
                <input
                  type="password"
                  ref={passwordConfirm}
                  required
                  placeholder="Confirm Password*"
                  className="form-control"
                />
                <button type="submit">Sign Up</button>
              </form>
              <div>
                {settings.settingsData.login.facebook && (
                  <button
                    variant="outline"
                    onClick={() => signIn("facebook")}
                    className={classes.facebook}
                  >
                    SIGN IN WITH FACEBOOK
                  </button>
                )}
                {settings.settingsData.login.google && (
                  <button
                    variant="outline"
                    onClick={() => signIn("google")}
                    className={classes.google}
                  >
                    SIGN IN WITH GOOGLE
                  </button>
                )}
              </div>
              </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

SignUpPage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (context) => {
    try {
      const { origin } = appUrl(context.req);
      const response = await fetchData(`${origin}/api/home/settings`);
      setSettingsData(store, response);
      const { req, res } = context;
      const session = await getSession({ req });
      if (session && res && session.user) {
        res.writeHead(302, {
          Location: "/",
        });
        res.end();
        return;
      }
      return {
        session: undefined,
      };
    } catch (err) {
      console.log(err);
      return {
        srvError: true,
      };
    }
  },
);

SignUpPage.footer = false;
