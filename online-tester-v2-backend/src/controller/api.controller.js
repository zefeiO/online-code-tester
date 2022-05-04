import express from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import fs from "fs";

import AuthMiddleware from "../middleware/auth.middleware.js";
import RedisService from "../service/redis.service.js";
import DataService from "../service/data.service.js";

const storageRule = multer.diskStorage({
    destination: (req, file, next) => {
        const path = `/Users/jamesou/Desktop/Projects/online-tester-v2/online-tester-v2-backend/tests/${Date.now()}`;
        fs.mkdirSync(path);
        next(null, path);
    },
    filename: (req, file, next) => {
        next(null, file.originalname);
    }
});


class ApiController {
    path = "/api";
    router = express.Router();
    #authMiddleware = null;
    #uploadMiddleware = multer({ storage: storageRule }).array("submissions", 2);

    constructor() {
        this.#authMiddleware = new AuthMiddleware();
        this.initRoutes();
    }

    initRoutes() {
        // this.router.use(this.#authMiddleware.verifyToken);
        this.router.post("/task", this.#uploadMiddleware, this.submitTask);
        this.router.get("/task", this.getTaskResult);
    }

    submitTask(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() }).end();
        }

        // Push task to redis (test_id, project_name)
        const { project_name, username } = req.body;
        const testId = req.files[0].destination.substring(80);
        const task = {
            project: project_name,
            test_id: testId
        }
        const redisService = new RedisService();

        try {
            redisService.push(task);
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
        
        // Add a new row to table Test
        const dataService = new DataService();
        dataService.addTest(testId, project_name, username, -1, "not completed")
            .then(success => {
                if (success) {
                    console.log("success");
                } else {
                    console.log("DB ERROR");
                    return res.status(500).end();
                }
            })

        // Return test_id to client
        return res.status(200).json({ test_id: testId }).end();
    }

    getTaskResult(req, res) {
        const { test_id } = req.body;
        
        // Fetch from Test table the row with id == req.test_id
        const dataService = new DataService();
        dataService.getTestById(test_id)
            .then(result => {
                if (result) {
                    console.log("success");
                    return res.status(200).json(result).end();
                } else {
                    console.log("DB ERROR");
                    return res.status(500).end();
                }
            })
    }

    getTaskHistory(req, res) {
        const { username } = req.body;
        
        // Fetch from Test table the rows with username == req.username
        const dataService = new DataService();
        dataService.getTestsByUser(username)
            .then(results => {
                if (results) {
                    console.log("success");
                    return res.status(200).json(results).end();
                } else {
                    console.log("DB ERROR");
                    return res.status(500).end();
                }
            })
    }

    #validateBody(type) {
        switch (type) {
            case "submitTask":
                return [
                    body("project_name").notEmpty(),
                    body("username").notEmpty().isLength({ min: 6 })
                ]
            case "getTaskResult":
                return [
                    body("test_id").notEmpty()
                ]
            case "getTaskHistory":
                return [
                    body("username").notEmpty()
                ]
        }
    }
}

export default ApiController;