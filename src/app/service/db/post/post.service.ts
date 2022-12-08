import { Post, PrismaClient } from "@prisma/client";
import { create } from "domain";
import {
  UpdateProfile,
  CreateUser,
  GetUserById,
  GetUserByUsername,
  UserOptions,
} from "../user/user.service";

export async function GetAllPosts(
  prisma: PrismaClient,
  offset: number = 0,
  limit: number = 20
): Promise<Post[] | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const posts = await prisma.post.findMany({ skip: offset, take: limit });
      prisma.$disconnect();
      return resolve(posts);
    } catch (err) {
      prisma.$disconnect();
      return reject(err);
    }
  });
}

export async function GetAllPostsFromUser(
  prisma: PrismaClient,
  uid: number,
  offset: number = 0,
  limit: number = 20
): Promise<Post[] | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const posts = await prisma.post.findMany({
        skip: offset,
        take: limit,
        where: {
          authorId: uid,
        },
      });
      prisma.$disconnect();
      return resolve(posts);
    } catch (err) {
      prisma.$disconnect();
      return reject(err);
    }
  });
}

export async function GetPostById(
  prisma: PrismaClient,
  id: number
): Promise<Post | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const post = await prisma.post.findUnique({ where: { id: id } });
      prisma.$disconnect();
      return resolve(post);
    } catch (err) {
      prisma.$disconnect();
      return reject(err);
    }
  });
}

export type PostData = {
  title: string;
  content: string;
  imageUrl: string;
  authorId: number;
};

export async function CreatePost(
  prisma: PrismaClient,
  data: PostData
): Promise<Post | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const newPost = await prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          image: data.imageUrl,
          author: {
            connect: {
              id: data.authorId,
            },
          },
        },
      });
      prisma.$disconnect();
      return resolve(newPost);
    } catch (err) {
      prisma.$disconnect();
      return reject(err);
    }
  });
}

export async function UpdatePost(
  prisma: PrismaClient,
  id: number,
  data: { title: string; content: string; imageUrl: string }
): Promise<Post | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const post = await prisma.post.update({
        where: { id: id },
        data: {
          ...data,
          title: data.title,
          content: data.content,
          image: data.imageUrl,
        },
      });
      prisma.$disconnect();
      return resolve(post);
    } catch (err) {
      prisma.$disconnect();
      return reject(err);
    }
  });
}

export async function DeletePost(
  prisma: PrismaClient,
  id: number
): Promise<Post | null> {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$connect();
      const post = await prisma.post.delete({
        where: { id: id },
      });
      prisma.$disconnect();
      return resolve(post);
    } catch (err) {
      prisma.$disconnect();
      return reject(err);
    }
  });
}
