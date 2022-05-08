module.exports = {
    post: {
        tags: ["Post controller"],
        description: "Insert a new comment",
        operationId: "insertComment",
        parameters: [
            {
                name: "comment",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/comment",
                },
                required: true,
                description: "New comment",
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