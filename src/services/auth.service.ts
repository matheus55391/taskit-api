import { PrismaClient } from "@prisma/client";
import { createUser, findUserByEmail } from "./user.service";
import { hashPassword } from "../utils/hash";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(prisma: PrismaClient, data: RegisterInput) {
  const userExists = await findUserByEmail(prisma, data.email);
  if (userExists) throw new Error("Email already registered");

  const hashedPassword = await hashPassword(data.password);

  return await createUser(prisma, {
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });
}
