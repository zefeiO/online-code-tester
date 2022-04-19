import AWS from "aws-sdk";
import crypto from "crypto"


class CognitoService {
    #config = {
        region: "us-east-1"
    };
    #secretHash = "1rr2lfi275dau5loeugqbr38fv3arf4o8q5thpqqr35tg3pivq3k";
    #clientId = "3lkufgse6e6g5h432mq9ehuslp";

    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.#config);
    }

    async signUpUser(username, password, email) {
        const params = {
            ClientId: this.#clientId, 
            Password: password,
            Username: username,
            SecretHash: this.#generateHash(username),
            UserAttributes: [].push({ Name: "email", Value: email})
        };

        try {
            const data = await this.cognitoIdentity.signUp(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async verifyConfirmationCode(username, code) {
        const params = {
            ClientId: this.#clientId,
            ConfirmationCode: code,
            SecretHash: this.#generateHash(username),
            Username: username
        };

        try {
            const data = await this.cognitoIdentity.confirmSignUp(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async signInUser(username, password) {
        const params = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: this.#clientId,
            AuthParameters: {
                "USERNAME": username,
                "PASSWORD": password,
                "SECRET_HASH": this.#generateHash(username)
            }
        };

        try {
            const data = this.cognitoIdentity.initiateAuth(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    #generateHash(username) {
        return crypto.createHmac("SHA256", this.#secretHash)
            .update(username + this.#clientId)
            .digest("base64");
    }
}

export default CognitoService;