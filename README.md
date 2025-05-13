# Taskit API

Taskit API is a Fastify based API for the backend of my personal project, inspired by ClickUp, Notion, and Trello. The focus is on providing a minimalist task listing structure for small and faster projects.

## About

This project is a study and development of my skills, and it's not intended to be a production-ready API.

## Running the Project

To run the project, use the following commands:

- `pnpm run dev`: Starts the development server.
- `pnpm run build`: Compiles the project.
- `pnpm start`: Runs the compiled project in production mode.

## Requirements

### Functional Requirements

- The API should have a RESTful interface.
- The API should have an endpoint to create a new project.
- The API should have an endpoint to list all projects.
- The API should have an endpoint to get a project by id.
- The API should have an endpoint to update a project.
- The API should have an endpoint to delete a project.
- The API should have an endpoint to create a new task.
- The API should have an endpoint to list all tasks.
- The API should have an endpoint to get a task by id.
- The API should have an endpoint to update a task.
- The API should have an endpoint to delete a task.

### Non-Functional Requirements

- The API should use a ORM (Object-Relational Mapping) to interact with the database.
- The API should be written in Typescript.
- The API should use Fastify as the web framework.
- The API should use Prisma as the ORM.
- The API should use a PostgreSQL database.

### User Stories

- As a user, I want to be able to create a new project so I can organize my tasks.
- As a user, I want to be able to list all projects so I can see all the projects I have.
- As a user, I want to be able to get a project by id so I can see the details of a project.
- As a user, I want to be able to update a project so I can change the details of a project.
- As a user, I want to be able to delete a project so I can remove a project I no longer need.
- As a user, I want to be able to create a new task so I can add a new task to a project.
- As a user, I want to be able to list all tasks so I can see all the tasks of a project.
- As a user, I want to be able to get a task by id so I can see the details of a task.
- As a user, I want to be able to update a task so I can change the details of a task.
- As a user, I want to be able to delete a task so I can remove a task I no longer need.
