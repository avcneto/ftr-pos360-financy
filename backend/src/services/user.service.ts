import { prisma } from "../db";
import { hashPassword } from "./auth.service";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const password = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password,
    },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}
