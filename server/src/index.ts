import express from "express";
import AWS from "aws-sdk";
import { config } from "dotenv";
config({ path: "./.env" });

const bucketName = process.env.BUCKET_NAME;

const app = express();

export const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  endpoint: `https://s3.${process.env.REGION}.amazonaws.com`,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

app.get("/write-object-url/:key", async (req, res) => {
  const signedUrl = await s3.getSignedUrlPromise("putObject", {
    Bucket: bucketName,
    Key: req.params.key,
    Expires: 6 * 3600,
  });
  res.json({
    url: signedUrl,
  });
});

app.get("/read-object-url/:key", async (req, res) => {
  const signedUrl = await s3.getSignedUrlPromise("getObject", {
    Bucket: bucketName,
    Key: req.params.key,
    Expires: 6 * 3600,
  });
  res.json({
    url: signedUrl,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`);
});
