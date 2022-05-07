module.exports = {
    get: {
        tags: ["User controller"],
        description: "Get user by username",
        operationId: "getByUsername",
        parameters: [
            {
                name: "username",
                in: "query",
                schema: {
                    $ref: "#/components/schemas/username",
                },
                required: true,
                description: "Username",
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