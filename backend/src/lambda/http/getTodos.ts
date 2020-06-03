import "source-map-support/register";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda";
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODO_ITEMS;

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	// TODO: Get all TODO items for a current user

	console.log("Processing event: ", event);
	const userId = "123";
	// const userId = getUserId(event);
	const result = await docClient
		.query({
			TableName: todosTable,
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
