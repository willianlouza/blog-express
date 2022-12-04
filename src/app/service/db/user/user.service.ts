import { PrismaClient, User } from "@prisma/client";

export type UserOptions = {
  username: string;
  password: string;
  name: string;
};
const prisma = new PrismaClient();

export async function CreateUser(options: UserOptions): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await prisma.user.create({
        data: {
          name: options.name,
          username: options.username,
          password: options.password,
        },
      });
      prisma.$disconnect();
      resolve(user);
    } catch (err) {
      prisma.$disconnect();
      reject(err);
    }
  });
}

export async function GetUserById(id: number): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      prisma.$disconnect();
      resolve(user);
    } catch (err) {
      prisma.$disconnect();
      reject(err);
    }
  });
}

export async function GetUserByUsername(
  username: string
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });
      prisma.$disconnect();
      resolve(user);
    } catch (err) {
      prisma.$disconnect();
      reject(err);
    }
  });
}

export async function ChangeUserName(
  id: number,
  name: string
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await prisma.user.update({
        data: {
          name: name,
        },
        where: { id: id },
      });
      prisma.$disconnect();
      resolve(user);
    } catch (err) {
      prisma.$disconnect();
      reject(err);
    }
  });
}
