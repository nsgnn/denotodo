import { Handlers, Status } from "$fresh/server.ts";
import {
  createTodoListItem,
  deleteTodoListItem,
  getTodoListInfoByName,
  pgPool,
} from "../../../database.ts";

/**
 * PUT request handler for the `/api/todo` endpoint. This will create a new todo list and save it to the database.
 * @param req The request sent to the server by the client. This is required to contain the values: `Name` and `Description`.
 * @returns Response will indicate the success of the todo list item saving. Failure to provide required fields will result in a 400 response.
 */
async function putTodoItem(req: Request): Promise<Response> {
  const queryParams = (new URL(req.url)).searchParams;
  // prevent escape characters by getting the raw strings.
  const listName = queryParams.has("name")
    ? String.raw`${queryParams.get("name")}`
    : undefined;
  const todoItem = queryParams.has("details")
    ? String.raw`${queryParams.get("details")}`
    : undefined;

  if (!listName || !todoItem) {
    // User failed to provide a name or details to create a todo list for.
    return new Response(null, {
      status: Status.BadRequest,
      statusText: "Query parameters 'name' and 'details' are required.",
    });
  }

  // Connect to the database.
  const connection = await pgPool.connect();
  try {
    const listId = (await getTodoListInfoByName(connection, listName))?.ListID;

    if (listId === undefined) {
      // Failure due to list not existing.
      return new Response(null, {
        status: Status.BadRequest,
        statusText: "Query parameter 'name' must be an existing todo list.",
      });
    }

    const transactionSuccess = await createTodoListItem(
      connection,
      listId,
      todoItem,
    );
    if (!transactionSuccess) {
      // Failure due to unknown reason.
      return new Response(null, {
        status: Status.InternalServerError,
      });
    }
  } finally {
    connection.release();
  }

  return new Response(null, {
    status: Status.Created,
  });
}

/**
 * DELETE request handler for the `/api/todo` endpoint. This will delete an existing todo list from the database.
 * @param req The request sent to the server by the client. This is required to contain the value: `Name`.
 * @returns Response will indicate the success of the todo list item deleting. Failure to provide required fields will result in a 400 response.
 */
async function deleteTodoItem(req: Request): Promise<Response> {
  const queryParams = (new URL(req.url)).searchParams;
  // prevent escape characters by getting the raw strings.
  const listName = queryParams.has("name")
    ? String.raw`${queryParams.get("name")}`
    : undefined;
  const todoItem = queryParams.has("details")
    ? String.raw`${queryParams.get("details")}`
    : undefined;

  if (!listName || !todoItem) {
    // User failed to provide a name or details to create a todo list for.
    return new Response(null, {
      status: Status.BadRequest,
      statusText: "Query parameters 'name' and 'details' are required.",
    });
  }

  // Connect to the database.
  const connection = await pgPool.connect();
  try {
    const listId = (await getTodoListInfoByName(connection, listName))?.ListID;

    if (listId === undefined) {
      // Failure due to list not existing.
      return new Response(null, {
        status: Status.BadRequest,
        statusText: "Query parameter 'name' must be an existing todo list.",
      });
    }

    const transactionSuccess = await deleteTodoListItem(
      connection,
      listId,
      todoItem,
    );
    if (!transactionSuccess) {
      // Failure due to unknown error.
      return new Response(null, {
        status: Status.InternalServerError,
      });
    }
  } finally {
    connection.release();
  }

  return new Response(null, {
    status: Status.OK,
  });
}

/**
 * The exported handlers will control any request sent to the `/api/todo` endpoint. Any method that is not implemented will return a 405 response.
 */
export const handler: Handlers = {
  PUT: putTodoItem,
  DELETE: deleteTodoItem,
};
