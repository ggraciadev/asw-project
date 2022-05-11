module.exports = {
    post: {
        tags: ["Post controller"],
        description: "Insert a new post",
        operationId: "insertPost",
        parameters: [
            {
                name: "post",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/post",
                },
                required: true,
                description: "New post",
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