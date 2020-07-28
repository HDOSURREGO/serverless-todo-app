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
			logger.info("Este el nombre del archivo subido al S3: ", key);
			console.log("Este el nombre del archivo subido al S3: ", key);
			if (!key.includes("_bw.jpg")) {
				const linkUrl: string =
					"https://" + bucketName + ".s3.amazonaws.com/" + key;
				logger.info("Este es el link para transformar: ", linkUrl);
				console.log("Este es el link para transformar: ", linkUrl);
				try {
					// const resultado = await filterImageFromURL(linkUrl);

					// const fileBuffer = fs.readFileSync(resultado);
					logger.info("Entre al try donde se hace la transformacion: ");
					console.log("Entre al try donde se hace la transformacion: ");
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
							logger.info(
								"Estos son los parametros despues de transformar: ",
								destparams
							);
							console.log(
								"Estos son los parametros despues de transformar: ",
								destparams
							);
							await s3.putObject(destparams).promise();
							logger.info(
								"Y aqui ya debe estar en el S3 guardado: ",
								destparams
							);
							console.log(
								"Y aqui ya debe estar en el S3 guardado: ",
								destparams
							);
						})
						.catch((e) => {
							logger.error(e);
							console.log("Jueputa!! Something went terribly wrong!");
						});
				} catch (error) {
					console.log("Este es mi error: ", error);
				}
			}
		}
	}
};
