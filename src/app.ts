import Fastify from "fastify";
import jwt from "./plugins/jwt";
import prisma from "./plugins/prisma";
import authRoutes from "./routes/auth.routes";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(prisma);
  app.register(jwt);
  app.register(authRoutes);

  return app;
}
