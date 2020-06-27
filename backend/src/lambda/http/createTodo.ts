import "source-map-support/register";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyHandler,
	APIGatewayProxyResult,
} from "aws-lambda";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import * as uuid from "uuid";
import { createLogger } from "../../utils/logger";
import * as AWS from "aws-sdk";
import { getUserId } from "../utils";

const logger = createLogger("Create-Todo-Log");

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	// TODO: Implement creating a new TODO item
	logger.info("Processing event: ", event);

	const userId = getUserId(event);
	const todoId = uuid.v4();
	const docClient = new AWS.DynamoDB.DocumentClient();
	const todosTable = process.env.TODO_ITEMS;
	const createTodoRequest: CreateTodoRequest = JSON.parse(event.body);

	const newTodo = {
		userId: userId,
		todoId: todoId,
		createdAt: new Date().toISOString(),
		name: createTodoRequest.name,
		dueDate: createTodoRequest.dueDate,
		done: false,
	};

	await docClient
		.put({
			TableName: todosTable,
			Item: newTodo,
		})
		.promise();

	return {
		statusCode: 201,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			item: newTodo,
		}),
	};
};
