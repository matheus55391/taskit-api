import Fastify from "fastify";
import jwt from "./plugins/jwt";
import prisma from "./plugins/prisma";
import authRoutes from "./routes/auth.routes";
import swagger from "./plugins/swagger";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(swagger);
  app.register(prisma);
  app.register(jwt);
  app.register(authRoutes);

  return app;
}
