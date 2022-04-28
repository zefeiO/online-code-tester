import express from "express";
import multer from "multer";
import { validationResult } from "express-validator";
import AuthMiddleware from "../middleware/auth.middleware.js";
import CognitoService from "../service/cognito.service.js";

const storageRule = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, `../tests/${Date.now()}`);
    },
    filename: (req, file, next) => {
        next(null, file.originalname);
    }
});


class ApiController {
    path = "/api";
    router = express.Router();
    #authMiddleware = null;
    #uploadMiddleware = multer({ storage: storageRule }).array("submissions"); 
    #poolRegion = "us-east-1";

    constructor() {
        this.#authMiddleware = new AuthMiddleware();
        this.initRoutes();
    }

    initRoutes() {
        this.router.use(this.#authMiddleware.verifyToken);
        this.router.post("/task", this.#uploadMiddleware, this.submitTask);
        this.router.get("/task", this.getTaskResult);
    }

    submitTask(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() }).end();
        }

        // Put submitted files into ../tests/test_id
        console.log(req.file);

        // Push task to redis (test_id, project_name)
        const { project_name, username } = req.body;
        const testId = req.file.destination.substring(9);
        
        // Add a new row to table Test: (test_id, projeoct_name, user_name, -1, "not completed")

        // Return test_id to client
        return res.status(200).json({ test_id: testId }).end();
    }

    getTaskResult(req, res) {
        // Fetch from Test table the row with id == req.test_id

        // Return Test.result_code and Test.result_string
    }

    getTaskHistory(req, res) {
        // Fetch from Test table the rows with username == req.username

        // Return Test.result_code and Test.result_string
    }
}

export default ApiController;