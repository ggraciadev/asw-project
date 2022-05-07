module.exports = {
    get: {
        tags: ["Post controller"],
        description: "Get post by id with one comment",
        operationId: "getByIdWithOneComment",
        parameters: [
            {
                name: "post_id",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/post_id",
                },
                required: true,
                description: "Post id",
            },{
                name: "comment_id",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/comment_id",
                },
                required: true,
                description: "Comment id",
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