import customId from "custom-id-new";
import Razorpay from "razorpay";

export default async function apiHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const body = req.body.cartData;
        const price = body.items.reduce(
          (accumulator, item) => accumulator + item.qty * item.price,
          0
        );
        const gst = body.items.reduce(
          (accumulator, item) => accumulator + item.qty * item.gst_amount,
          0
        );
        const payAmount =body.deliveryInfo.cost +
          (price - (body.coupon.discount / 100) * price);

        const razorpay = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          key_secret: process.env.NEXT_PUBLIC_RAZORPAY_SECRET,
        });

        const currency = "INR";
        const tid = "T" + customId({ randomLength: 4, upperCase: true });
        const options = {
          amount: (payAmount * 100).toString(),
          currency,
          receipt: tid,
        };
        const response = await razorpay.orders.create(options);
        res.status(200).json({
          id: response.id,
          currency: response.currency,
          amount: response.amount,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
