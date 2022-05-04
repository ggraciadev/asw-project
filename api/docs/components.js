module.exports = {
    components: {
        schemas: {
            id: {
                type: "string",
                description: "The id of the user",
                example: "62514abbe83aaaa11025098f"
            },
            comment_id: {
                type: "string",
                description: "The id of the comment",
                example: "62514abbe83a8f"
            },
            username: {
                type: "string",
                description: "The username",
                example: "awakt"
            },
            post_id: {
                type: "string",
                description: "The id of the post",
                example: "62514abbe83a8f"
            },
            aboutMe: {
                type: "string",
                description: "The description about the user",
                example: "I am a FIBer doing my ASW Project"
            },
            phone: {
                type: "number",
                description: "The user phone number",
                example: "684123807"
            },
            linkedIn: {
                type: "string",
                description: "The user linkedIn account",
                example: "awakt"
            },
            github: {
                type: "string",
                description: "The users github account",
                example: "awakt"
            },
        }
    }
}