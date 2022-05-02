from time import time
import redis, time, subprocess

from data import DataService

r = redis.Redis("localhost", 6379)

PROJECT_QUEUE = "project"
TESTID_QUEUE = "test_id"
SUPPORTED_PROJECT = ["ECE250_Project4"]

TESTS_PATH = "/Users/jamesou/Desktop/Projects/online-tester-v2/online-tester-v2-backend/tests"
ECE250_PROJECT4_PATH = "/Users/jamesou/Desktop/Projects/online-tester-v2/online-tester-v2-coderunner/ECE250_Project4"

if __name__ == "__main__":
    while True:
        # Listen to redis queue for requested tests
        project_name = r.lpop(PROJECT_QUEUE)
        if not project_name:
            time.sleep(0.1)
            continue
        test_id = r.lpop(TESTID_QUEUE)

        # Step1: compile the submissions
        # Step2: call test_maker.py to generate inputs
        # Step3: call test_verifer.py to judge the outputs
        if project_name == "ECE250_Project4":
            subprocess.run(["g++", "-std=c++11", f"{TESTS_PATH}/{test_id}/Project4_main.cpp", "-o", f"{TESTS_PATH}/{test_id}/main"])
            
            subprocess.run(["python3", f"{ECE250_PROJECT4_PATH}/test_maker.py"])
            subprocess.run(["cp", f"{ECE250_PROJECT4_PATH}/input.txt", f"{TESTS_PATH}/{test_id}/input.txt"])

            subprocess.run([f"{TESTS_PATH}/{test_id}/main", f"{TESTS_PATH}/{test_id}/input.txt", ">", f"{TESTS_PATH}/{test_id}/output.txt"])
            
            result = subprocess.run(["python3", f"{ECE250_PROJECT4_PATH}/test_verifer.py", f"{ECE250_PROJECT4_PATH}/output.txt", ">", f"{ECE250_PROJECT4_PATH}/result.txt"])
            result_code = result.returncode
            with open(f"{ECE250_PROJECT4_PATH}/result.txt") as f:
                result_string = f.read().rstrip()
        else:
            result_code = -2
            result_string = "project not supported"

        with DataService() as ds:
            ds.updateTest(test_id, result_code, result_string)
        