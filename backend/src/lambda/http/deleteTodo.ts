import "source-map-support/register";
import { createLogger } from "../../utils/logger";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda";
import * as AWS from "aws-sdk";

const logger = createLogger("Todo-Access-Layer");

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	// TODO: Remove a TODO item by id

	console.log("Delete in Process", event);

	const userId = "123";
	const todoId = "345";
	const todosTable = process.env.TODO_ITEMS;
	const docClient = new AWS.DynamoDB.DocumentClient();

	logger.info("Delete todo " + todoId + "for user" + userId);

	await docClient
		.delete({
			TableName: todosTable,
			Key: {
				userId: userId,
				todoId: todoId,
			},
			ConditionExpression: "todoId = :todoId",
			ExpressionAttributeValues: {
				":todoId": todoId,
			},
		})
		.promise();

	return {
		statusCode: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: "Item Deleted",
	};
};
