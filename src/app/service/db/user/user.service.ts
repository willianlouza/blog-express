import { PrismaClient, User } from "@prisma/client";

export type UserOptions = {
  username: string;
  password: string;
  name: string;
};

export async function CreateUser(
  prisma: PrismaClient,
  options: UserOptions
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const user = await prisma.user.create({
        data: {
          name: options.name,
          username: options.username,
          password: options.password,
          iconUrl:
            "https://res.cloudinary.com/dsd9hrqmo/image/upload/v1670164808/user_mzard4.png",
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

export async function GetUserById(
  prisma: PrismaClient,
  id: number
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const user = await prisma.user.findUnique({
        where: { id: +id },
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
  prisma: PrismaClient,
  username: string
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
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

export async function UpdateFullProfile(
  prisma: PrismaClient,
  id: number,
  name: string,
  iconUrl: string
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const user = await prisma.user.update({
        data: {
          name: name,
          iconUrl: iconUrl,
        },
        where: { id: +id },
      });
      prisma.$disconnect();
      resolve(user);
    } catch (err) {
      prisma.$disconnect();
      reject(err);
    }
  });
}

export async function UpdateName(
  prisma: PrismaClient,
  id: number,
  name: string
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const user = await prisma.user.update({
        data: {
          name: name,
        },
        where: { id: +id },
      });
      prisma.$disconnect();
      resolve(user);
    } catch (err) {
      prisma.$disconnect();
      reject(err);
    }
  });
}

export async function UpdateIcon(
  prisma: PrismaClient,
  id: number,
  iconUrl: string
): Promise<User | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const user = await prisma.user.update({
        data: {
          iconUrl: iconUrl,
        },
        where: { id: +id },
      });
      prisma.$disconnect();
      resolve(user);
    } catch (err) {
      prisma.$disconnect();
      reject(err);
    }
  });
}
