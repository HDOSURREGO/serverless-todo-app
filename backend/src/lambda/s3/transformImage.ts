import { SNSHandler, SNSEvent } from "aws-lambda";
import { createLogger } from "../../utils/logger";
import Jimp from "jimp";
// import fs from "fs";
import * as AWS from "aws-sdk";
// import sharp from "sharp";

const s3 = new AWS.S3();
const logger = createLogger("S3-Event-File_Uploaded");
const bucketName = process.env.ATTACHMENT_S3_BUCKET;

/**
 * Entry point of lambda when a file is uploaded to the S3 bucket
 *
 * @param event
 */
export const handler: SNSHandler = async (event: SNSEvent) => {
	logger.info("Processing SNS event ", JSON.stringify(event));
	for (const snsRecord of event.Records) {
		const s3EventStr = snsRecord.Sns.Message;
		const s3Event = JSON.parse(s3EventStr);

		for (const record of s3Event.Records) {
			const key = record.s3.object.key;
			logger.info("This is the file to upload to S3: ", key);
			console.log("This is the file to upload to S3: ", key);
			if (!key.includes("_bw.jpg")) {
				const linkUrl: string =
					"https://" + bucketName + ".s3.amazonaws.com/" + key;

				try {
					await Jimp.read(linkUrl)
						.then(async (image) => {
							const buffer = await image
								.resize(256, 256) // resize
								.quality(60) // set JPEG quality
								.greyscale() // set greyscale
								.getBufferAsync(Jimp.MIME_JPEG);
							const destparams = {
								Bucket: bucketName,
								Key: key + "_bw.jpg",
								Body: buffer,
								ContentType: "image",
							};
							await s3.putObject(destparams).promise();
						})
						.catch((e) => {
							logger.error(e);
							console.log("Something went terribly wrong!");
						});
				} catch (error) {
					console.log("This is my error: ", error);
				}
			}
		}
	}
};
