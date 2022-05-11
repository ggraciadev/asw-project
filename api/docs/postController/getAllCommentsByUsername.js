module.exports = {
    get: {
        tags: ["Post controller"],
        description: "Get all comments made by a user",
        operationId: "getAllCommentsByUsername",
        parameters: [
            {
                name: "username",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/username",
                },
                required: true,
                description: "Username",
            }
        ],
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