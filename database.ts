import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";
export { PoolClient } from "https://deno.land/x/postgres@v0.14.0/client.ts";

// @ts-ignore We have to add the toJSON for this type for serialization later on.
BigInt.prototype.toJSON = function() { return this.toString() }


/**
 *  Retrieve connection url from environment.
 */
const databaseUrl = Deno.env.get("DATABASE_URL");

/**
 * Create a pool of database connections to use.
 */ 
export const pgPool = new postgres.Pool(databaseUrl, 5, true);