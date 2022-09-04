import { Handlers, Status } from "$fresh/server.ts";
import { pgPool, getTodoListInfoByName, getTodoListItemsByListID } from "../../database.ts";



  /**
   * GET request handler for the `/api/todo` endpoint. This will return a todo list based on the name provided in the request.
   * @param req The request sent to the server by the client. This is required to contain the query param: `name`.
   * @returns Response will be the todo list requested found based on the `Name` field. Failure to provide required fields will result in a 400 response.
   */
async function getTodo(req: Request): Promise<Response> {
  let responseBody: string | null = null;
  const queryParams = (new URL(req.url)).searchParams;
  // prevent escape characters by getting the raw string.
  const name = queryParams.has("name") ? String.raw`${queryParams.get("name")}` : undefined; 

  if(name === undefined) {
    // User failed to provide a name to find a todo list for.
    return new Response(null, {
      status: Status.BadRequest,
      statusText: "Query parameter 'name' is required."
    });
  }
  console.log(typeof name);

  // Connect to the database.
  const connection = await pgPool.connect();
  try {
    const reqTodoList = await getTodoListInfoByName(connection, name);
    if(!reqTodoList) {
      // We did not find a todo list by that name.
      return new Response(null, {
        status: Status.NoContent,
        statusText: "No Content."
      });
    }
    reqTodoList.items = await getTodoListItemsByListID(connection, reqTodoList.ListID); 
    responseBody = JSON.stringify(reqTodoList, null, 4);
  } finally {
    connection.release();
  }
  
  return new Response(responseBody, {
    status: Status.OK
  });
}

/**
 * The exported handlers will control any request sent to the `/api/todo` endpoint. Any method that is not implemented will return a 405 response.
 */
export const handler: Handlers = {
  GET: getTodo ,

  /**
   * POST request handler for the `/api/todo` endpoint. This will create a new todo list and save it to the database.
   * @param req The request sent to the server by the client. This is required to contain the values: `Name` and `Description`.
   * @returns Response will indicate the success of the todo list item saving. Failure to provide required fields will result in a 400 response.
   */
  POST(req) {
    console.log(req.body);
    return new Response("", {
      status: Status.NotImplemented
    });
  },

  /**
   * DELETE request handler for the `/api/todo` endpoint. This will delete an existing todo list from the database.
   * @param req The request sent to the server by the client. This is required to contain the value: `Name`.
   * @returns Response will indicate the success of the todo list item deleting. Failure to provide required fields will result in a 400 response.
   */
  DELETE(req) {
    console.log(req.body);
    return new Response("", {
      status: Status.NotImplemented
    });
  },
  

};