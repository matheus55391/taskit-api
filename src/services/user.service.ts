import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/hash";

export async function findUserByEmail(prisma: PrismaClient, email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user !== null;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function createUser(prisma: PrismaClient, data: RegisterInput) {
  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });
}
