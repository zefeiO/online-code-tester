import pkg from "express";
const { Reuqest, Response } = pkg;
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import fetch from "node-fetch";


let pems = {};
class AuthMiddleware {
    #poolRegion = "us-east-1";
    #userPoolId = "us-east-1_bJU6Kkye8";

    constructor() {
        this.#setup();
    }

    verifyToken(req, res, next) {
        const token = req.header("Auth");
        if (!token) {
            return res.status(401).end();
        }

        let decodeJwt = jwt.decode(JSON.parse(token), { complete: true });
        if (!decodeJwt) {
            return res.status(401).end();
        }
        let kid = decodeJwt.header.kid;
        let pem = pems[kid];
        if (!pem) {
            return res.status(401).end();
        }

        
        jwt.verify(JSON.parse(token), pem, (err, payload) => {
            if (err) {
                return res.status(401).end();
            }
            next();
        });
    }

    async #setup() {
        const URL = `https://cognito-idp.${this.#poolRegion}.amazonaws.com/${this.#userPoolId}/.well-known/jwks.json`;

        try {
            const response = await fetch(URL);
            if (response.status != 200) {
                throw "request not successful";
            }
            const data = await response.json();
            const { keys } = data;

            keys.forEach(key => {
                const key_id = key.kid;
                const modulus = key.n;
                const exponent = key.e;
                const key_type = key.kty;
                const jwk = { kty: key_type, n: modulus, e: exponent };
                const pem = jwkToPem(jwk);
                pems[key_id] = pem
            });

            // for (let index = 0; index < keys.length; index++) {
            //     const key = keys[index];
            //     const key_id = key.kid;
            //     const modulus = key.n;
            // }

            console.log("got all pems");
        } catch (error) {
            console.log("sorry could not fetch jwks");
        }
    }
}

export default AuthMiddleware;