import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";
import { PoolClient } from "https://deno.land/x/postgres@v0.14.0/client.ts";
import { TodoList, TodoListInfo, TodoListItem } from "./models/todo.d.ts";

// @ts-ignore We have to add the toJSON for this type for serialization later on.
BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 *  Retrieve connection url from environment.
 */
const databaseUrl = Deno.env.get("DATABASE_URL");

/**
 * Create a pool of database connections to use.
 */
export const pgPool = new postgres.Pool(databaseUrl, 5, true);

/**
 * @param connection connection to database to use
 * @param name The name of the list that we want to retrieve
 * @returns The requested todo list or undefined.
 */
export async function getTodoListInfoByName(
  connection: PoolClient,
  name: string,
): Promise<TodoList | undefined> {
  const todoListQueryResults = await connection.queryObject<TodoListInfo>`
        select * from "TodoLists" where name = ${name}
        `;
  // First (and only possible) result or undefined.
  return todoListQueryResults.rows?.[0] as TodoList | undefined;
}

/**
 * @param connection connection to database to use
 * @param name The name of the list that we want to create
 * @param description The description of the list that we want to create
 * @returns The success on creation of the todo list.
 */
export async function createTodoList(
  connection: PoolClient,
  name: string,
  description: string,
): Promise<boolean> {
  try {
    await connection.queryObject<TodoListInfo>`
            INSERT INTO "TodoLists" (name, description) VALUES (${name}, ${description})
            `;
  } catch (_) {
    // On any error, return false.
    return false;
  }
  // Creation success.
  return true;
}

/**
 * @param connection connection to database to use
 * @param ListID The list we want to retrieve items for.
 * @returns The requested todo list items or an empty array.
 */
export async function getTodoListItemsByListID(
  connection: PoolClient,
  ListID: number,
): Promise<Array<TodoListItem>> {
  const items = await connection.queryObject<TodoListItem>`
    select ID, text from "TodoListItems" where list = ${ListID}
`;
  return items.rows;
}
