module.exports = {
    get: {
        tags: ["Post controller"],
        description: "Get post by id",
        operationId: "getById",
        parameters: [
            {
                name: "id",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/id",
                },
                required: true,
                description: "User id",
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