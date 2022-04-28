import App from "./app.js";

import HomeController from "./controller/home.controller.js";
import AuthController from "./controller/auth.controller.js";
import ProtectedController from "./controller/protected.controller.js";
import ApiController from "./controller/api.controller.js";

import bodyParser from "body-parser";

const app = new App({
    port: 3000,
    controllers: [
        new HomeController(),
        new AuthController(),
        new ProtectedController(),
        new ApiController()
    ],
    middlewares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true })
    ],
})

app.listen();