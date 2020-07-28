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

		console.log("Este es el evento que llegó ", s3Event);

		for (const record of s3Event.Records) {
			const key = record.s3.object.key;
			logger.info(key);
			if (!key.includes("_bw.jpg")) {
				const linkUrl: string =
					"https://" + bucketName + ".s3.amazonaws.com/" + key;
				try {
					// const resultado = await filterImageFromURL(linkUrl);

					// const fileBuffer = fs.readFileSync(resultado);

					Jimp.read(linkUrl)
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

					// Upload the thumbnail image to the destination bucket
					// try {
					// 	const destparams = {
					// 		Bucket: bucketName,
					// 		Key: key + "_bw.jpg",
					// 		Body: fileBuffer,
					// 		ContentType: "image",
					// 	};
					// 	await s3.putObject(destparams).promise();
					// } catch (error) {
					// 	console.log(error);
					// 	return;
					// }

					// // const resultado = await createThumbnail(key);
					// console.log(resultado);
				} catch (error) {
					console.log("Este es mi error: ", error);
				}
			}
		}
	}
};

// async function filterImageFromURL(inputURL: string): Promise<string> {
// 	return new Promise(async (resolve) => {
// 		const photo = await Jimp.read(inputURL);
// 		const outpath =
// 			"/tmp/filtered." + Math.floor(Math.random() * 2000) + "_bw.jpg";
// 		const buffer = await photo.quality(1).getBufferAsync(jimp.MIME_JPEG);
// 		await photo
// 			.resize(256, 256) // resize
// 			.quality(60) // set JPEG quality
// 			.greyscale() // set greyscale
// 			.write(__dirname + outpath, () => {
// 				resolve(__dirname + outpath);
// 			});
// 	});
// }

// async function createThumbnail(key: string) {
// 	// Download the image from the S3 source bucket.
// 	let origimage;
// 	try {
// 		const params = {
// 			Bucket: bucketName,
// 			Key: key,
// 		};
// 		origimage = await s3.getObject(params).promise();
// 	} catch (error) {
// 		console.log(error);
// 		return;
// 	}

// set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
// const width = 200;
// Use the Sharp module to resize the image and save in a buffer.
// 	let buffer;
// 	try {
// 		buffer = await sharp(origimage.Body).resize(width).toBuffer();
// 	} catch (error) {
// 		console.log(error);
// 		return;
// 	}

// 	// Upload the thumbnail image to the destination bucket
// 	try {
// 		const destparams = {
// 			Bucket: bucketName,
// 			Key: key + "_bw.jpg",
// 			Body: buffer,
// 			ContentType: "image",
// 		};
// 		await s3.putObject(destparams).promise();
// 	} catch (error) {
// 		console.log(error);
// 		return;
// 	}
// }
// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
// export async function deleteLocalFiles(files: Array<string>) {
// 	for (let file of files) {
// 		fs.unlinkSync(file);
// 	}
// }
