# Headless To-do API

### Usage

Deno is required to run the server. This can be found
[here](https://deno.land/manual@v1.25.1/getting_started/installation).

Environment variables required:

- DATABASE_URL: This is the connection string for the Postgres Database.

Start the project in dev mode:

```
deno task start
```

Build a docker image for production:

```
docker build --build-arg GIT_REVISION=$(git rev-parse HEAD) -t denotodo .
```

Run a production image:

```
docker run -t -i -p 80:8000 deno-to-do
```
