import express from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";

class ApiController {
    path = "/api";
    router = express.Router();
    #authMiddleware = null;

    constructor() {
        this.#authMiddleware = new AuthMiddleware();
        this.initRoutes();
    }

    initRoutes() {
        this.router.use(this.#authMiddleware.verifyToken);
        this.router.post("/task", this.task);
    }

    task(req, res) {
        
    }

    
}

export default ApiController;