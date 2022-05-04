module.exports = {
    put: {
        tags: ["User controller"],
        description: "Like a Post",
        operationId: "likePost",
        parameters: [
            ,{
                name: "post_id",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/post_id",
                },
                required: true,
                description: "post id",
            },{
                name: "username",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/username",
                },
                required: true,
                description: "User name",
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