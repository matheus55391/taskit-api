import { FastifyRequest, FastifyReply } from "fastify";
import { registerUser } from "../services/auth.service";
import { findUserByEmail } from "../services/user.service";
import { comparePassword } from "../utils/hash";

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

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  try {
    const user = await findUserByEmail(request.server.prisma, email);

    if (!user) {
      return reply.code(401).send("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return reply.code(401).send("Invalid email or password");
    }

    const token = await reply.jwtSign({ sub: user.id, email: user.email });

    return reply.send({ token });
  } catch (error) {
    return reply.code(500).send(error);
  }
}
