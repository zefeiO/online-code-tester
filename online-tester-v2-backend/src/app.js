import express from "express";

class App {
    constructor(appInit) {
        this.app = express();
        this.port = appInit.port;
        this.middlewares(appInit.middlewares);
        this.routes(appInit.controllers);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        })
    }

    routes(controllers) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        })
    }

    middlewares(middlewares) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        })
    }
}

export default App;