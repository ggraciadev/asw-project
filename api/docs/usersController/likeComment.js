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
            },
            {
                name: "apikey",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/apikey",
                },
                required: true,
                description: "Api Key",
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