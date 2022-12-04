import express from "express";
export default class App {
    constructor() {
        this.server = express();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.server.use(express.json());
    }
    routes() {
    }
}
