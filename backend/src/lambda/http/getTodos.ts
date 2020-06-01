import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const docClient = new AWS.DynamoDB.DocumentClient();
const todoTable = process.env.TODO_ITEMS;
const logger = createLogger("getTodosFunctionLog");

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	// TODO: Get all TODO items for a current user
	const userId = getUserId(event);

	logger.info("Processing event: ", event);

	const result = await docClient
		.query({
			TableName: todoTable,
			KeyConditionExpression: "userId = :userId",
			ExpressionAttributeValues: {
				":userId": userId,
			},
			ScanIndexForward: false,
		})
		.promise();

	const items = result.Items;

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			items,
		}),
	};
};
