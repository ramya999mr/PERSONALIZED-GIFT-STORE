import Spinner from "../Spinner";
import classes from "./preloader.module.css";

export default function Preloader() {
  return (
    <div className={classes.display}>
      <Spinner color="#393939" />
    </div>
  );
}
