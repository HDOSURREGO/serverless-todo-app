import "source-map-support/register";
import * as AWS from "aws-sdk";
import { getUserId } from "../utils";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyHandler,
	APIGatewayProxyResult,
} from "aws-lambda";
import { createLogger } from "../../utils/logger";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";

const logger = createLogger("Update-Todo-Log");

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	// const todoId = event.pathParameters.todoId;

	logger.info("Processing event: ", event);

	const todoId = event.pathParameters.todoId;
	const userId = getUserId(event);
	const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
	const docClient = new AWS.DynamoDB.DocumentClient();
	const todosTable = process.env.TODO_ITEMS;

	// TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

	await docClient
		.update({
			TableName: todosTable,
			Key: {
				userId: userId,
				todoId: todoId,
			},
			ConditionExpression: "todoId = :todoId",
			UpdateExpression: "set #n = :name, dueDate = :dueDate, done = :done",
			ExpressionAttributeValues: {
				":name": updatedTodo.name,
				":dueDate": updatedTodo.dueDate,
				":done": updatedTodo.done,
				":todoId": todoId,
			},
			ExpressionAttributeNames: {
				"#n": "name",
			},
			ReturnValues: "UPDATED_NEW",
		})
		.promise();

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: "Update Successfull",
	};
};
