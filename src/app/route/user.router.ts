import { Router, Request } from "express";
import userController from "../controller/user.controller";
import { auth } from "../middleware/auth";

const userRouter: Router = Router();

userRouter.post("/signup", userController.SignUp);
userRouter.post("/signin", userController.SignIn);
userRouter.get("/user/:id", auth, userController.GetUser);
userRouter.get("/author/:id", userController.GetUser);
userRouter.patch("/user/:id/update", auth, userController.UpdateProfile);

export default userRouter;
