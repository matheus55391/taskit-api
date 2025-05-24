import { FastifyRequest, FastifyReply } from "fastify";
import { registerUser } from "../services/auth.service";
import { findUserByEmail } from "../services/user.service";
import { comparePassword } from "../utils/hash";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  // Validate request body with Zod
  const parseResult = registerSchema.safeParse(request.body);
  if (!parseResult.success) {
    return reply.code(400).send({
      error: "Invalid input",
      details: parseResult.error.errors,
    });
  }
  const { name, email, password } = parseResult.data;

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
  // Validate request body with Zod
  const parseResult = loginSchema.safeParse(request.body);
  if (!parseResult.success) {
    return reply.code(400).send({
      error: "Invalid input",
      details: parseResult.error.errors,
    });
  }
  const { email, password } = parseResult.data;

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
