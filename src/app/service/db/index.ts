import {
  UpdateIcon,
  UpdateName,
  UpdateFullProfile,
  CreateUser,
  GetUserById,
  GetUserByUsername,
  UserOptions,
} from "./user/user.service";
import {
  CreatePost,
  DeletePost,
  GetAllPosts,
  GetAllPostsFromUser,
  GetPostById,
  PostData,
  UpdatePost,
} from "./post/post.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const User = {
  updateProfile: (id: number, name: string, iconUrl: string) =>
    UpdateFullProfile(prisma, id, name, iconUrl),
  updateName: (id: number, name: string) => UpdateName(prisma, id, name),
  updateIcon: (id: number, iconUrl: string) => UpdateIcon(prisma, id, iconUrl),
  createNew: (username: UserOptions) => CreateUser(prisma, username),
  getById: (id: number) => GetUserById(prisma, id),
  getByUsername: (username: string) => GetUserByUsername(prisma, username),
};

export const Post = {
  create: (data: PostData) => CreatePost(prisma, data),
  delete: (id: number) => DeletePost(prisma, id),
  getAll: (offset: number, limit: number) => GetAllPosts(prisma, offset, limit),
  getAllFromUser: (id: number, offset: number, limit: number) =>
    GetAllPostsFromUser(prisma, id, offset, limit),
  getById: (id: number) => GetPostById(prisma, id),
  updatePost: (
    id: number,
    data: { title: string; content: string; imageUrl: string }
  ) => UpdatePost(prisma, id, data),
};
