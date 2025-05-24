import fromZodSchema from "zod-to-json-schema";
import { registerSchema, loginSchema } from "./schemas/auth.schema";
import { FastifyInstance } from "fastify";
import { login, register } from "./controllers/auth.controller";

const registerBodySchema = fromZodSchema(registerSchema);
const loginBodySchema = fromZodSchema(loginSchema);

export async function routes(app: FastifyInstance) {
  // auth routes
  app.post(
    "/auth/register",
    {
      schema: {
        body: registerBodySchema,
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
              details: { type: "array" },
            },
          },
        },
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Creates a new user and returns a JWT token.",
      },
    },
    register
  );

  app.post(
    "/auth/login",
    {
      schema: {
        body: loginBodySchema,
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
              details: { type: "array" },
            },
          },
          401: {
            type: "string",
          },
        },
        tags: ["Auth"],
        summary: "Login user",
        description: "Authenticate user and return JWT token.",
      },
    },
    login
  );
}
