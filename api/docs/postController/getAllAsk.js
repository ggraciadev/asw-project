module.exports = {
    get: {
        tags: ["Post controller"],
        description: "Get all posts without url",
        operationId: "getAllAsk",
        parameters: [
            {
                name: "orderby",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/order_by",
                },
                required: true,
                description: "Order by likes/creationTime",
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