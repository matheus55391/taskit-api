import { login, register } from "./controllers/auth.controller";
import { FastifyTypedInstance } from "./types";
import { loginSchema, registerSchema } from "./schemas/auth.schema";

export async function routes(app: FastifyTypedInstance) {
  // Register the Swagger plugin
  app.register(AuthRoutes, { prefix: "/auth" });
}

function AuthRoutes(app: FastifyTypedInstance) {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        description: "Login a user",
        body: loginSchema,
      },
    },
    login
  );

  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        description: "Register a new user",
        body: registerSchema,
      },
    },
    register
  );
}
