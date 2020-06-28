import "source-map-support/register";
import { getUserId } from "../utils";
import { updateTodo } from "../../businessLogic/todos";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyHandler,
	APIGatewayProxyResult,
} from "aws-lambda";

import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { createLogger } from "../../utils/logger";

const logger = createLogger("Update-Todo");

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	logger.info("Processing event: ", event);

	const todoId = event.pathParameters.todoId;
	const userId = getUserId(event);
	const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

	// TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
	await updateTodo(todoId, userId, updatedTodo);

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: "",
	};
};
