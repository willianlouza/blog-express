import { Request, Response } from "express";

class PostController {
  //Load all posts
  public async GetPostsAll(req: Request, res: Response) {}
  //Load all posts from a specific user
  public async GetPostUser(req: Request, res: Response) {}
  //Load one post
  public async GetPost(req: Request, res: Response) {}
  //Delete one post
  public async DeletePost(req: Request, res: Response) {}
  //Update one post
  public async UpdatePost(req: Request, res: Response) {}
  //Add one post
  public async WritePost(req: Request, res: Response) {}
}
