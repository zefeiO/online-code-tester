import express from "express";
import { body, validationResult } from "express-validator";

import CognitoService from "../service/cognito.service.js";


class AuthController {
    constructor() {
        this.path = "/auth"
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/signup", this.#validateBody("signup"), this.signup);
        this.router.post("/signin", this.#validateBody("signin"), this.signin);
        this.router.post("/verify", this.#validateBody("verify"), this.verify);
    }

    signup(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() })
        }

        const { username, password, email } = req.body;
        const cognito = new CognitoService();

        cognito.signUpUser(username, password, email)
            .then(success => {
                if (success) {
                    console.log("success");
                    res.status(200).end();
                } else {
                    res.status(500).end();
                }
            });
    }

    signin(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() })
        }
        
        const { username, password } = req.body;
        const cognito = new CognitoService();

        cognito.signInUser(username, password)
            .then(data => {
                if (data) {
                    console.log("success");
                    const { AccessToken } = data.AuthenticationResult;
                    res.status(200).json({ access_token: AccessToken }).end();
                } else {
                    res.status(500).end();
                }
            });
    }

    verify(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() })
        }
        
        const { username, code } = req.body;

        const cognito = new CognitoService();
        cognito.verifyConfirmationCode(username, code)
            .then(success => {
                if (success) {
                    console.log("success");
                    res.status(200).end();
                } else {
                    res.status(500).end();
                }
            });
    }


    #validateBody(type) {
        switch(type) {
            case "signup":
                return [
                    body("username").notEmpty().isLength({ min: 6 }),
                    body("email").normalizeEmail().isEmail(),
                    body("password").isString().isLength({ min: 8 })
                ]
            case "signin":
                return [
                    body("username").notEmpty().isLength({ min: 6 }),
                    body("password").isString().isLength({ min: 8 })
                ]
            case "verify":
                return [
                    body("username").notEmpty().isLength({ min: 6 }),
                    body("code").isString().isLength({ min: 6, max: 8 })
                ]
        }
    }
}

export default AuthController;