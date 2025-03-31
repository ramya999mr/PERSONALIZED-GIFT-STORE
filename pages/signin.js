import { getCsrfToken, getSession, signIn } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Error500 from "~/components/error/500";
import HeadData from "~/components/Head";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
import classes from "~/styles/signin.module.css";
import Image from "next/image";

export default function SignIn({ authCsrfToken, srvError }) {
  const { error } = useRouter().query;
  const settings = useSelector((state) => state.settings);
  const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  };
  const SignInError = ({ error }) => {
    const errorMessage = error && (errors[error] ?? errors.default);
    return <div className="alert alert-danger">{errorMessage}</div>;
  };

  return (
    <>
      {srvError ? (
        <Error500 />
      ) : (
        <>
          <HeadData title="Sign in" />

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
                  <h1>SIGN IN</h1>
                  {error && <SignInError error={error} />}
                  <form
                    action="/api/auth/callback/credentials"
                    method="POST"
                    className={classes.form}
                  >
                    <input
                      name="csrfToken"
                      type="hidden"
                      defaultValue={authCsrfToken}
                    />
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="username"
                      placeholder="Email"
                      required
                    />
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                    />
                    <div className={classes.reset_link}>
                      <Link href="/reset">
                        <a>Forget your password?</a>
                      </Link>
                    </div>
                    <button type="submit">SIGN IN</button>
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

SignIn.getInitialProps = wrapper.getInitialPageProps(
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
        authCsrfToken: await getCsrfToken(context),
      };
    } catch (err) {
      console.log(err);
      return {
        srvError: true,
      };
    }
  }
);

SignIn.footer = false;
