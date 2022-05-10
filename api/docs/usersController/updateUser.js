module.exports = {
    put: {
        tags: ["User controller"],
        description: "Update user information",
        operationId: "updateUser",
        parameters: [
            /* {
                name: "username",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/username",
                },
                required: true,
                description: "Username",
            }, 
            {
                name: "aboutme",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/about_me",
                },
                required: true,
                description: "A brief description about the user",
            }, 
            {
                name: "phone",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/phone",
                },
                required: true,
                description: "Phone number",
            }, 
            {
                name: "linkedin",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/linked_in",
                },
                required: true,
                description: "Linkedin account",
            }, 
            {
                name: "github",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/github",
                },
                required: true,
                description: "Github account",
            }    */
            {
                name: "username",
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