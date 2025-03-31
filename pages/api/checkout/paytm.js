import customId from "custom-id-new";
import PaytmChecksum from "~/lib/PaytmChecksum";
import https from "https";
import axios from "axios";

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
        console.log(JSON.stringify(body.items, null, 2));
        const gst = body.items.reduce(
          (accumulator, item) => accumulator + item.qty * item.gst_amount,
          0
        );
        const payAmount =
          body.deliveryInfo.cost +
          (price - (body.coupon.discount / 100) * price);

        const orderId = `R${customId({ randomLength: 4, upperCase: true })}`;

        const paytmParams = {};

        paytmParams.body = {
          requestType: "Payment",
          mid: process.env.NEXT_PUBLIC_PAYTM_MID,
          websiteName: "printmine",
          orderId: orderId,
          callbackUrl: `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`,
          txnAmount: {
            value: "1100",
            currency: "INR",
          },
          userInfo: {
            custId: customId({ randomLength: 4, upperCase: true }),
          },
        };
        var response = "";

        PaytmChecksum.generateSignature(
          JSON.stringify(paytmParams.body),
          process.env.NEXT_PUBLIC_PAYTM_MERCHANT_KEY
        ).then(function (checksum) {
          paytmParams.head = {
            signature: checksum,
          };

          var options = {
            /* for Staging */
            hostname: "securegw-stage.paytm.in",

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${orderId}`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": post_data.length,
            },
          };
          var post_req = https.request(options, function (post_res) {
            post_res.on("data", function (chunk) {
              response += chunk;
            });

            post_res.on("end", function () {
              response = JSON.parse(response);
              console.log("Response: ", response);
            });
          });

          post_req.write(post_data);
          post_req.end();
        });
        const url = "https://securegw-stage.paytm.in";
        const uri = `${url}/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${orderId}`;
        var post_data = JSON.stringify(paytmParams);
        // const response = await axios({
        //   method: "post",
        //   url: uri,
        //   data: paytmParams,
        //   headers: {
        //     "Content-Type": "application/json",
        //     "Content-Length": post_data.length,
        //   },
        // }).then((res) => res.data);
        console.log(response);
        res.status(200).json({
          mid: paytmParams.body.mid,
          orderId: orderId,
          token: response.body.txnToken,
          amount: 110,
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
