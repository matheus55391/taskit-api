import { FastifyInstance } from "fastify";
import { register } from "../controllers/auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/register", register);
}
