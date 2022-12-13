import { Router } from "express";
import postController from "../controller/post.controller";
import { auth } from "../middleware/auth";

const postRouter: Router = Router();

postRouter.get("/post/all", postController.GetAllPosts);
postRouter.get("/post/:id", postController.GetPost);
postRouter.get("/user/:id/post", auth, postController.GetPostFromUser);
postRouter.delete("/user/:id/post/:postId", auth, postController.DeletePost);
postRouter.patch(
  "/user/:id/post/edit/:postId",
  auth,
  postController.UpdatePost
);
postRouter.post("/user/:id/post/write", auth, postController.WritePost);

export default postRouter;
