import { getSession } from "next-auth/client";
import orderModel from "../../../models/order";
import dbConnect from "../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  const session = await getSession({ req });
  if (!session)
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "PUT":
      try {
        const id = req.body.id;
        const order = await orderModel.findOne({ orderId: id });
        if (
          order &&
          order.status === "Pending" &&
          order.paymentStatus === "Unpaid"
        ) {
          order.status = "Canceled";
          await order.save();
        } else {
          throw new Error("Illegal order cancellation request");
        }
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
