module.exports = {
    put: {
        tags: ["User controller"],
        description: "Update user information",
        operationId: "updateUser",
        parameters: [
            {
                name: "user",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/user",
                },
                required: true,
                description: "User",
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