import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(prisma: PrismaClient, data: RegisterInput) {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (userExists) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });
}
