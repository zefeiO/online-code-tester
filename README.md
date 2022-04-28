# online-code-tester

## Data Model
### Table: Project

|id     |name   |
| :---: | :---: |
|0      |""     |

### Table: Test

|id     |project_name|user_name|test_id|result_code      |result_string      |
| :---: | :--------: | :-----: | :---: | :-------------: | :---------------: | 
|0      |""          |""       |0      |-1(not completed)|"not completed yet"|


## Authentication
Authentication for this project is done with AWS Cognito.<br/>
* Documentation: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/cognito-user-identity-pools-apiref.pdf#Welcome<br/>

### API
* Sign up: `POST /auth/signup`<br/>
    >Request body<br/>
    ```
    {
        "username": ...,
        "password": ...,
        "email": ...
    }
    ```
* Verify confirmation code: `POST /auth/verify`<br/>
    >Request body<br/>
    ```
    {
        "username": ...,
        "code": ...
    }
    ```
* Sign in: `POST /auth/signin`<br/>
    >Request body<br/>
    ```
    {
        "username": ...,
        "password": ...
    }
    ```
    >Response body<br/>
    {
        "jwt": ...
    }

## RESTful-API
All APIs are guarded by an authentication middleware that checks the jwt, which should be present in `Auth` field within the header.
* `POST /api/task`<br>
    Submit task with source files for testing, which are stored in directory "/tests/{test_id}". <br>
    The server then pushes the test request to redis and the test request will be processed by a code runner process. <br>
    Add a new row in the test table with the status being "not completed".
    >Request body (multipart/form-data)

|KEY|VALUE|
|submissions|files...|
|project_name|"..."|
|username|"..."|

    >Response body
    ```
    {
        "test_id": ...(int encoded with password),
        "wait_time": 13
    }
    ```

* Get result for specified test: `GET /api/task`<br>
    >Request body
    ```
    {
        "test_id": ...(test_id retrieved previously)
    }
    ```
    >Response body
    ```
    {
        "test_id": ...(int),
        "result_code": ...(int),
        "result_string": "..."
    }
    ```

* Get results for all past submissions: `GET /api/history`<br>
    >Request body
    ```
    {
        "username": "..."
    }
    ```
    >Response body
    ```
    {
        tests: [
            {
                "test_id": ...(int),
                "result_code": ...(int),
                "result_string": "..."
            },
            ...
        ]
    }
    ```

## Sandboxed code runner
### Option 1: firejail
Documentation: https://firejail.wordpress.com<br/>
```bash
firejail main input.txt > output.txt
```
### Option 2: Google Sandboxed API
Github: https://github.com/google/sandboxed-api<br/>
Documentation: https://developers.google.com/code-sandboxing/sandboxed-api/getting-started#debian-10-buster