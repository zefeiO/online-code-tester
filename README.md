# online-code-tester

## Data Model
### Table: Project

|id     |name   |
| :---: | :---: |
|0      |""     |

### Table: User

|id     |username|password|
| :---: | :----: | :----: |
|0      |""      |""      |

### Table: Test

|id     |project_name|user_id|time_stamp|result_code      |result_string      |
| :---: | :--------: | :---: | :------: | :-------------: | :---------------: | 
|0      |""          |0      |...       |-1(not completed)|"not completed yet"|

## API
* User login: `POST /api/login`<br>
    >Request body<br>
    ```
    {
        "username": "...",
        "password": "..."
    }
    ```
    >Response body
    ```
    {
        "jwt": "..."
    }
    ```

* Submit task with source files for testing: `POST /api/task`<br>
    >Request body
    ```
    {
        "jwt": "...",
        "project_name": "...",
        "files": []
    }
    ```
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
        "jwt": "...",
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
        "jwt": "...",
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
Documentation: https://firejail.wordpress.com<br/>
```bash
firejail main input.txt > output.txt
```