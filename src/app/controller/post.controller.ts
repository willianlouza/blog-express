import { Request, Response } from "express";
import API_Status from "../enum/API_Status";
import { Post, User } from "../service/db";
import { PostData } from "../service/db/post/post.service";

class PostController {
  //Load all posts
  public async GetAllPosts(
    req: Request<{}, {}, {}, { limit?: number; offset?: number }>,
    res: Response
  ) {
    try {
      const { limit, offset } = req.query;
      const take = limit === undefined ? 10 : limit;
      const skip = offset === undefined ? 0 : offset;

      const posts = await Post.getAll(skip, take);
      if (!posts || posts.length === 0) {
        return res.status(404).json({
          status: API_Status.ERROR,
          message: "Nenhuma publicação encontrada",
        });
      }

      return res.status(200).json({ status: API_Status.OK, posts });
    } catch (err) {
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Não foi possível encontrar as publicações",
      });
    }
  }
  //Load all posts from a specific user
  public async GetPostFromUser(
    req: Request<{ id: number }, {}, {}, { offset?: number; limit?: number }>,
    res: Response
  ) {
    try {
      const { id } = req.params;
      const { limit, offset } = req.query;
      const take = limit === undefined ? 10 : limit;
      const skip = offset === undefined ? 0 : offset;
      const post = await Post.getAllFromUser(id, skip, take);
      if (!post) {
        return res.status(404).json({
          status: API_Status.ERROR,
          message: "Nenhuma publicação encontrada",
        });
      }
      return res.status(200).json({ status: API_Status.OK, post });
    } catch (err) {
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Não foi possível encontrar as publicações",
      });
    }
  }
  //Load one post
  public async GetPost(req: Request<{ id: number }>, res: Response) {
    try {
      const { id } = req.params;
      const post = await Post.getById(id);
      if (!post) {
        return res.status(404).json({
          status: API_Status.ERROR,
          message: "Publicação não encontrada",
        });
      }
      const author = await User.getById(post.authorId);
      const name = author?.name;

      return res
        .status(200)
        .json({ status: API_Status.OK, post, author: name });
    } catch (err) {
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Não foi possível encontrar a publicação",
      });
    }
  }
  //Delete one post
  public async DeletePost(
    req: Request<{ postId: number }, {}, {}, {}>,
    res: Response
  ) {
    try {
      const { postId } = req.params;
      const post = await Post.delete(postId);
      if (!post)
        return res
          .status(404)
          .json({ status: API_Status.ERROR, message: "Publicação não existe" });
      return res.status(200).json({ status: API_Status.OK, post });
    } catch (err) {
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Ocorreu um erro ao deletar a publicação",
      });
    }
  }
  //Update one post
  public async UpdatePost(
    req: Request<
      { postId: number },
      {},
      { title: string; content: string; imageUrl: string },
      {}
    >,
    res: Response
  ) {
    try {
      const { postId } = req.params;
      const { title, content, imageUrl } = req.body;
      const post = await Post.updatePost(postId, { title, content, imageUrl });
      if (!post)
        return res.status(404).json({
          status: API_Status.ERROR,
          message: "Publicação não encontrada",
        });
      return res.status(200).json({ status: API_Status.OK, post });
    } catch (err) {
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Ocorreu um erro ao atualizar a publicação",
      });
    }
  }
  //Add one post
  public async WritePost(
    req: Request<
      { id: number },
      {},
      { title: string; content: string; imageUrl: string },
      {}
    >,
    res: Response
  ) {
    try {
      const { id } = req.params;
      const data: PostData = {
        title: req.body.title,
        content: req.body.content,
        authorId: +id,
        imageUrl: req.body.imageUrl,
      };

      const post = await Post.create(data);

      if (!post)
        return res.status(404).json({
          status: API_Status.ERROR,
          message: "Não foi possível publicar",
        });
      return res.status(200).json({ status: API_Status.OK, post });
    } catch (err) {
      return res.status(500).json({
        status: API_Status.ERROR,
        message: "Erro ao publicar o conteúdo",
      });
    }
  }
}

export default new PostController();
