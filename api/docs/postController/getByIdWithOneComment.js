module.exports = {
    get: {
        tags: ["Post controller"],
        description: "Get post by id with one comment",
        operationId: "getByIdWithOneComment",
        parameters: [
            {
                name: "id",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/id",
                },
                required: true,
                description: "User id",
            },{
                name: "comment_id",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/comment_id",
                },
                required: true,
                description: "comment id",
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