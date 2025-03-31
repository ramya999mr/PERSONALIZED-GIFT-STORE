import customId from "custom-id-new";
import FormData from "form-data";
import { getSession } from "next-auth/client";
import { currencyConvert } from "~/lib/clientFunctions";
import orderModel from "~/models/order";
import settingModel from "~/models/setting";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

const ssl_url = process.env.NEXT_PUBLIC_SSLCOMMERZ_PAYMENT_API_URL;

export default async function apiHandler(req, res) {
  const { method } = req;
  const session = await getSession({ req });
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const settingData = await settingModel.findOne({});
        const _currency = settingData.currency.name;
        const body = await JSON.parse(req.body.order);
        const { cartData, exchangeRate } = body;
        const price = cartData.items.reduce(
          (accumulator, item) => accumulator + item.qty * item.price,
          0,
        );
        const discountPrice =
          cartData.deliveryInfo.cost +
          ((price - (cartData.coupon.discount / 100) * price) * 10) / 10;
        const payAmountUsd = currencyConvert(discountPrice, exchangeRate);
        const trnId = "T" + customId({ randomLength: 4, upperCase: true });
        const orderId = `R${customId({ randomLength: 4, upperCase: true })}`;
        const sslData = {
          store_id: process.env.NEXT_PUBLIC_SSLCOMMERZ_ID,
          store_passwd: process.env.NEXT_PUBLIC_SSLCOMMERZ_PASS,
          total_amount: _currency === "BDT" ? discountPrice : payAmountUsd,
          currency: _currency === "BDT" ? "BDT" : "USD",
          tran_id: trnId,
          success_url: `${process.env.NEXT_PUBLIC_URL}/api/checkout/process_order_ssl?status=success&order_id=${orderId}`,
          fail_url: `${process.env.NEXT_PUBLIC_URL}/api/checkout/process_order_ssl?status=fail&order_id=${orderId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/api/checkout/process_order_ssl?status=cancel&order_id=${orderId}`,
          ipn_url: `${process.env.NEXT_PUBLIC_URL}/api/checkout/process_order_ssl?status=ipn&order_id=${orderId}`,
          shipping_method: "NO",
          product_name: cartData.items[0].name,
          product_category: "Clothing",
          product_profile: "general",
          cus_name: cartData.billingInfo.fullName,
          cus_email: cartData.billingInfo.email,
          cus_add1: cartData.billingInfo.house,
          cus_city: cartData.billingInfo.city,
          cus_postcode: cartData.billingInfo.zipCode,
          cus_country: cartData.billingInfo.country,
          cus_phone: cartData.billingInfo.phone,
        };
        const formData = new FormData();
        for (const value in sslData) {
          formData.append(value, sslData[value] ? sslData[value] : "");
        }
        const resp = await fetch(ssl_url, {
          method: "POST",
          body: formData,
        });
        const response = await resp.json();

        if (response.status === "SUCCESS") {
          const { coupon, items, billingInfo, shippingInfo, deliveryInfo } =
            cartData;
          const paymentStatus = "Unpaid";
          const orderData = {
            orderId,
            products: items,
            status: "Draft",
            billingInfo,
            shippingInfo,
            deliveryInfo,
            paymentMethod: "Sslcommerz",
            paymentStatus,
            paymentId: null,
            totalPrice: price,
            payAmount: discountPrice,
            coupon,
          };
          const createdOrder = await orderModel.create(orderData);
          if (session && session.user.id) {
            await userModel.findByIdAndUpdate(session.user.id, {
              $push: { orders: createdOrder._id },
            });
          }
          res.redirect(response.GatewayPageURL);
        } else {
          res.status(500).json({ message: response.failedreason });
        }
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
