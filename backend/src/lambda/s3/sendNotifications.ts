import { SNSHandler, SNSEvent } from "aws-lambda";
import { createLogger } from "../../utils/logger";

const logger = createLogger("S3-Event-File_Uploaded");

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

		console.log("Este es el evento en la funcion: ", s3Event);

		// await processS3Event(s3Event);
	}
};
