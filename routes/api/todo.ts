import { Handlers, Status } from "$fresh/server.ts";
import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

const databaseUrl = Deno.env.get("DATABASE_URL");

const pgPool = new postgres.Pool(databaseUrl, 5, true);

/**
 * The exported handlers will control any request sent to the `/api/todo` endpoint. Any method that is not implemented will return a 405 response.
 */
export const handler: Handlers = {

  /**
   * GET request handler for the `/api/todo` endpoint. This will return a todo list based on the name provided in the request.
   * @param req The request sent to the server by the client. This is required to contain the query param: `name`.
   * @returns Response will be the todo list requested found based on the `Name` field. Failure to provide required fields will result in a 400 response.
   */
  GET(req) {
    console.log(req.url);
    return new Response("", {
      status: Status.NotImplemented
    });
  },

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
