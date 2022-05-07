module.exports = {
    get: {
        tags: ["Post controller"],
        descirption: "Get all posts",
        operationId: "getAll",
        parameters: [],
        responses: {
            200: {
                description: "Successful operation",
            },
            500: {
                description: "Internal server error",
            }
        }
    }
}