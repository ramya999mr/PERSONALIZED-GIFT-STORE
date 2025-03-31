import aws from "aws-sdk";

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

export default async function s3DeleteFiles(fileList) {
  try {
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: fileList,
      },
    };
    await s3.deleteObjects(params).promise();
  } catch (err) {
    console.log(err);
  }
}
