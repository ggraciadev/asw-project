module.exports = {
    put: {
        tags: ["User controller"],
        description: "Like a Comment",
        operationId: "likeComment",
        parameters: [
            {
                name: "comment_id",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/comment_id",
                },
                required: true,
                description: "Comment id",
            },
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