module.exports = {
    get: {
        tags: ["Post controller"],
        description: "Get all posts liked by a user",
        operationId: "getLikedPosts",
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