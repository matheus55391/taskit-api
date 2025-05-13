import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "super-secret",
  });
});
import type { JWT } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    jwt: JWT;
  }
}
