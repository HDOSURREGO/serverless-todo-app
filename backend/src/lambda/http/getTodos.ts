import "source-map-support/register";
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler,
} from "aws-lambda";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { getTodos } from "../../businessLogic/todos";

const logger = createLogger("Get-All-Todo");

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	// TODO: Get all TODO items for a current user
	logger.info("Processing event: ", event);
	const allTodos = await getTodos(getUserId(event));

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			items: allTodos,
		}),
	};
};
