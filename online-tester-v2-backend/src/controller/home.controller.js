import express from "express";


class HomeController {
    constructor() {
        this.path = "/"
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.home)
    }

    home(req, res) {
        res.send("success");
    }
}

export default HomeController;