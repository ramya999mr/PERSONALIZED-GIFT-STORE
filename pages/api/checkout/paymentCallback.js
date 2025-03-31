export default function paynow(req, res) {
  if (req.method === "POST") {
    console.log("ddf cb =>>>", req.body);
    res.send(req.body);
  } else {
    res.send("NO");
  }
}
