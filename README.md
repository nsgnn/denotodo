# Headless To-do API

### Deployment information

- The project is automatically deployed to Deno Deploy to allow for testing the API without any cloning required.
    - Please find the deployment at [nsgnn-denotodo.deno.dev](https://nsgnn-denotodo.deno.dev).
- The testing for this was manually done with Postman and documented example runs, eleven in total, in postman found [here](https://documenter.getpostman.com/view/20706352/VUxXLjLB).

### Notes on possible future work

The project requirements were delivered through 4 specifications that are met within the current codebase. Any additional thoughts I have about next steps will be documented below.

#### Improvements identified outside of scope:
    - Create a way to delete a todo list after creation.
    - Might be better to delete or add items to a todolist based off id rather than name.
    - Automated testing to be ran before deployment.

#### Identified Tech Debt:
    - Unify response format to be more informational.
    - There is no verification that the database connection string is valid.
    - The database is not utilizing DI for better breakaway for later refactoring to new backend.


### Local Usage

Deno is required to run the server. This can be found
[here](https://deno.land/manual@v1.25.1/getting_started/installation).

#### Environment variables required:

- DATABASE_URL: This is the connection string for the Postgres Database.

#### Start the project in dev mode:

```
deno task start
```

#### Build a docker image for production:

```
docker build --build-arg GIT_REVISION=$(git rev-parse HEAD) -t denotodo .
```

#### Run a production image:

```
docker run -t -i -p 80:8000 deno-to-do
```

### Database Information
- The database schema utilized is shown below.

```
create table TodoLists (
  listid bigint not null primary key,
  name text not null,
  description text
);

create table TodoListItems (
  id bigint not null primary key,
  text text not null,
  list bigint not null
);
```