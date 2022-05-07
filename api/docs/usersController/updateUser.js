module.exports = {
    put: {
        tags: ["User controller"],
        description: "Update a user",
        operationId: "updateUser",
        parameters: [
            {
                name: "user",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/user",
                },
                required: true,
                description: "update existing user",
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