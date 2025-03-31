import classes from "./403.module.css";
import Link from "next/link";

const Error403 = () => {
  return (
    <div className={classes.body}>
      <div className={classes.body_container}>
        <div className={classes.ntfnd}>
          <div className={classes.error}>
            <h1>403</h1>
          </div>
          <h2>access forbidden</h2>
          <p>You do not have permission to access the document or program that you requested.
            <br />
            <Link href="/">
              <a> Return to homepage</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error403;