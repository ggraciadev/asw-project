module.exports = {
    get: {
        tags: ["Post controller"],
        description: "Get all posts by username",
        operationId: "getAllPostsByUsername",
        parameters: [
            {
                name: "username",
                in: "body",
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