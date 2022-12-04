import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import userRouter from "./app/route/user.router";

export default class App {
  server: express.Application;
  constructor() {
    this.server = express();
    this.middleware();
    this.routes();
  }
  middleware() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(bodyParser.json());
  }
  routes() {
    this.server.use(userRouter)
  }
}
