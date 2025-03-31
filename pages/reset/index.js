import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import LoadingButton from "~/components/Ui/Button";
import { postData } from "~/lib/clientFunctions";

const ResetPage = () => {
  const [buttonState, setButtonState] = useState("");
  const email = useRef(null);
  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();

  if (session && session.user) {
    router.push("/");
  }

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      setButtonState("loading");
      const { success, err } = await postData(`/api/reset`, {
        email: email.current.value.trim(),
      });
      success
        ? toast.success(
            `An email has been sent to ${email.current.value} with further instructions.`,
          )
        : toast.error(err);
    } catch (err) {
      toast.error(err.message);
    }
    setButtonState("");
  };
  return (
    <>
      <HeadData title="Reset Password" />
      <div className="layout_top text-center mb-5">
        <div className="col-md-6 mx-auto py-5">
          <h1 className="py-4">Reset Password</h1>
          <form onSubmit={handleForm}>
            <div className="mb-4">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Email Address"
                ref={email}
                required
              />
            </div>
            <LoadingButton
              type="submit"
              state={buttonState}
              text="Send Password Reset Link"
            />
            <br />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPage;
