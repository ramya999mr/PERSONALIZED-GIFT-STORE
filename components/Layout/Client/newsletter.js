import { memo, useRef } from "react";
import { toast } from "react-toastify";
import { postData } from "~/lib/clientFunctions";
import classes from "./newsletter.module.css";

const Newsletter = () => {
  const email = useRef("");

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const response = await postData("/api/subscribers/new", {
        email: email.current.value.trim(),
      });
      response.success
        ? toast.success("You Have Subscribed Successfully")
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  }

  return (
    <div className="col-12">
      <div className={classes.content}>
        <h2 className={classes.heading}>JOIN OUR NEWSLETTER</h2>
        <p className={classes.subheading}>
          Be the fast to get the latest news, promotions, and much more!
        </p>
        <form onSubmit={handleSubmit}>
          <input
            className={classes.custom_input}
            type="email"
            name="email"
            placeholder="Your email address"
            required
            ref={email}
          />
          <button className={classes.button} type="submit">
            JOIN NOW
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(Newsletter);
