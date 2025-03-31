import classes from "./spinner.module.css";

const Spinner = ({ color }) => {
  return (
    <div className={classes.container}>
      <div
        className={classes.spinner}
        style={color && { borderRight: `8px solid ${color}` }}
      ></div>
    </div>
  );
};

export default Spinner;
