module.exports = {
    put: {
        tags: ["User controller"],
        description: "Like a comment",
        operationId: "likeComment",
        parameters: [
            {
                name: "commentid",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/comment_id",
                },
                required: true,
                description: "Comment id",
            },
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