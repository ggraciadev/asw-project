module.exports = {
    put: {
        tags: ["User controller"],
        description: "Like a Post",
        operationId: "likePost",
        parameters: [
            {
                name: "post_id",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/post_id",
                },
                required: true,
                description: "Post id",
            },
            {
                name: "logged_user",
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