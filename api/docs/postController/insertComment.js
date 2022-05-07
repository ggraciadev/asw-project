module.exports = {
    post: {
        tags: ["Post controller"],
        description: "Insert comment",
        operationId: "insertComment",
        parameters: [
            ,{
                name: "post",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/comment",
                },
                required: true,
                description: "new comment",
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