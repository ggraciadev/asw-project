module.exports = {
    post: {
        tags: ["Post controller"],
        description: "Reply an existing comment",
        operationId: "insertComment",
        parameters: [
            {
                name: "comment",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/reply",
                },
                required: true,
                description: "New reply",
            }            
        ],
        responses: {
            200: {
                description: "Successful operation",
                content: {
                    "application/json": {}
                }
            },
            404 : {
                description: "Parent comment not found",
            },
            500: {
                description: "Internal server error",
            }
        }
    }
}