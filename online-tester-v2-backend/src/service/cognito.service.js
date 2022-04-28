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
        let userAttributes = [];
        userAttributes.push({ Name: "email", Value: email });
        const params = {
            ClientId: this.#clientId, 
            Password: password,
            Username: username,
            SecretHash: this.#generateHash(username),
            UserAttributes: userAttributes
        };

        console.log(params);

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

    async getUsername(jwt) {
        console.log("Not supported");
        return null;
        
        const URL = `https://cognito-idp.${this.#config.region}.amazonaws.com/`;
        
        let username = null;
        
        try {
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify({AccessToken: jwt}),
                headers: {
                    "Content-Type": "application/x-amz-json-1.1",
                    "Content-Length": 1162,
                    "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser"
                }
            });
            if (response.status != 200) {
                console.log(response);
                throw "request not successful";
                
            }
            const data = await response.json();
            
            username = data.username;
        } catch (error) {
            console.log("sorry could not fetch username");
        }

        return username;
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
            const data = await this.cognitoIdentity.initiateAuth(params).promise();
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    #generateHash(username) {
        return crypto.createHmac("SHA256", this.#secretHash)
            .update(username + this.#clientId)
            .digest("base64");
    }


}

export default CognitoService;