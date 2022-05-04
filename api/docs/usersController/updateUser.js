module.exports = {
    put: {
        tags: ["User controller"],
        description: "Like a Post",
        operationId: "likePost",
        parameters: [
            ,{
                name: "username",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/username",
                },
                required: true,
                description: "User name",
            }
            ,{
                name: "about me",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/aboutMe",
                },
                required: true,
                description: "User description about me",
            }
            ,{
                name: "phone",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/phone",
                },
                required: true,
                description: "User phone number",
            }
            ,{
                name: "linkedIn",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/linkedIn",
                },
                required: true,
                description: "User linkedIn account",
            }
            ,{
                name: "github",
                in: "body",
                schema: {
                    $ref: "#/components/schemas/github",
                },
                required: true,
                description: "User github account",
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