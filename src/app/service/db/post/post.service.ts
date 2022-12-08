import { Post, PrismaClient } from "@prisma/client";
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
      const posts = await prisma.post.findMany({ skip: offset, take: limit });
      return resolve(posts);
    } catch (err) {
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
      const posts = await prisma.post.findMany({
        skip: offset,
        take: limit,
        where: {
          authorId: uid,
        },
      });
      return resolve(posts);
    } catch (err) {
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
      const post = await prisma.post.findUnique({ where: { id: id } });
      return resolve(post);
    } catch (err) {
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
      const newPost = await prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          image: data.imageUrl,
          authorId: data.authorId,
        },
      });
      return resolve(newPost);
    } catch (err) {
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
      const post = await prisma.post.update({
        where: { id: id },
        data: {
          title: data.title,
          content: data.content,
          image: data.imageUrl,
        },
      });
      return resolve(post);
    } catch (err) {
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
      const post = await prisma.post.delete({
        where: { id: id },
      });
      return resolve(post);
    } catch (err) {
      return reject(err);
    }
  });
}
