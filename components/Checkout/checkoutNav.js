import { BagCheck, CreditCard, InfoCircle, Truck, ViewList } from "@styled-icons/bootstrap";
import classes from "./checkout.module.css";

const CheckoutNav = ({ tab }) => {
  return (
    <div className={classes.nav}>
      <div className={tab === 1 ? classes.active : null}>
        <Truck width={30} height={30} />
        <span>Delivery info</span>
      </div>
      <div className={tab === 2 ? classes.active : null}>
        <InfoCircle width={30} height={30} />
        <span>Billing Info</span>
      </div>
      <div className={tab === 3 ? classes.active : null}>
        <Truck width={30} height={30} />
        <span>Shipping info</span>
      </div>
      <div className={tab === 4 ? classes.active : null}>
        <ViewList width={30} height={30} />
        <span>Review order</span>
      </div>
      <div className={tab === 5 ? classes.active : null}>
        <CreditCard width={30} height={30} />
        <span>Payment</span>
      </div>
      <div className={tab === 6 ? classes.active : null}>
        <BagCheck width={30} height={30} />
        <span>Confirmation</span>
      </div>
    </div>
  )
}

export default CheckoutNav;