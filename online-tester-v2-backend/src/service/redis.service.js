import { createClient } from "redis"

class RedisService {
    #redisClient = null
    #taskQueue = {
        qProject: "project",
        qTestId: "test_id"
    }
    
    constructor() {
        this.#redisClient = createClient();
        this.#redisClient.on("error", (err) => {
            console.log("Redis Client Error", err);
        });

        await this.#redisClient.connect();
    }

    push(task) {
        this.#redisClient.RPUSH(this.#taskQueue.qProject, task.project, (err, reply) => {
            if (err) throw err;
            console.log(reply);
        });
        this.#redisClient.RPUSH(this.#taskQueue.qTestId, task.test_id, (err, reply) => {
            if (err) throw err;
            console.log(reply);
        });
    }
}

export default RedisService;