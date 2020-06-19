import "source-map-support/register";
import { createLogger } from "../../utils/logger";
import * as AWS from "aws-sdk";

import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const logger = createLogger("Generate-Upload-Url-Log");
	const userId = "123";
	const todoId = "94897b60-dd0f-44f4-a728-2408e8c12d75";
	const s3 = new AWS.S3({ signatureVersion: "v4" });
	const bucketName = process.env.ATTACHMENT_S3_BUCKET;
	const docClient = new AWS.DynamoDB.DocumentClient();
	const todosTable = process.env.TODO_ITEMS;
	const signedUrlExpireSeconds = 60 * 5;

	// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
	logger.info("Processing event: ", event);

	const url = s3.getSignedUrl("putObject", {
		Bucket: bucketName,
		Key: todoId,
		Expires: signedUrlExpireSeconds,
	});

	const attachmentUrl: string =
		"https://" + bucketName + ".s3.amazonaws.com/" + todoId;
	const options = {
		TableName: todosTable,
		Key: {
			userId: userId,
			todoId: todoId,
		},
		UpdateExpression: "set attachmentUrl = :r",
		ExpressionAttributeValues: {
			":r": attachmentUrl,
		},
		ReturnValues: "UPDATED_NEW",
	};

	await docClient.update(options).promise();

	return {
		statusCode: 200,
		headers: { "Access-Control-Allow-Origin": "*" },
		body: JSON.stringify({
			uploadUrl: url,
		}),
	};
};
