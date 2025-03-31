import aws from "aws-sdk";
import customId from "custom-id-new";
import sessionChecker from "~/lib/sessionPermission";

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "general")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  switch (method) {
    case "POST":
      try {
        const { query } = req;
        const imageName =
          customId({ randomLength: 10, lowerCase: true }) + query.name;

        const params = {
          Bucket: bucketName,
          Key: imageName,
          Expires: 120,
        };

        const url = await s3.getSignedUrlPromise("putObject", params);
        res.status(200).json({ success: true, name: imageName, url });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: err.message });
      }
      break;

    case "DELETE":
      try {
        const { query } = req;
        const params = {
          Bucket: bucketName,
          Key: query.name,
        };
        await s3.deleteObject(params).promise();
        res.status(200).json({ success: true, err: null });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: err.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
