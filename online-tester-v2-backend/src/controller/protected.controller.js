import express from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";

class ProtectedController {
    path = "/protected";
    router = express.Router();
    #authMiddleware = null;

    constructor() {
        this.#authMiddleware = new AuthMiddleware();
        this.initRoutes();
    }

    initRoutes() {
        this.router.use(this.#authMiddleware.verifyToken);
        this.router.get("/secrets", this.home);
    }

    home(req, res) {
        res.send("got to keep it secret");
    }
}

export default ProtectedController;