class DataService {
    // TODO: 
    async addTest(testId, projectName, username, resultCode, resultString) {
        return true;
    }

    // TODO:
    async getTestById(testId) {
        return {
            result_code: -1,
            result_string: "not completed"
        }
    }

    // TODO:
    async getTestsByUser(username) {
        return [{
            resultCode: -1,
            resultString: "not completed"
        }, ]
    }
}

export default DataService;