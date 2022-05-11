module.exports = {
    put: {
        tags: ["User controller"],
        description: "Like a post",
        operationId: "likePost",
        parameters: [
            {
                name: "postid",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/post_id",
                },
                required: true,
                description: "Post id",
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