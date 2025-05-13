import { FastifyRequest, FastifyReply } from "fastify";
import { registerUser } from "../services/auth.service";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body as {
    name: string;
    email: string;
    password: string;
  };

  try {
    const user = await registerUser(request.server.prisma, {
      name,
      email,
      password,
    });

    const token = await reply.jwtSign({ sub: user.id, email: user.email });

    return reply.send({ token });
  } catch (error) {
    return reply.code(400).send("Email already exists");
  }
}
