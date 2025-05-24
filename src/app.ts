import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import jwt from "./plugins/jwt";
import prisma from "./plugins/prisma";
import swagger from "./plugins/swagger";
import { routes } from "./routes";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, { origin: "*" });

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Taskit API",
        description: "API documentation for Taskit",
        version: "0.0.1",
      },
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.register(prisma);
  app.register(jwt);
  app.register(routes);

  return app;
}
