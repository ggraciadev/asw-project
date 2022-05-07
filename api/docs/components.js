module.exports = {
    components: {
        schemas: {
            id: {
                type: "number",
                description: "The id of the user",
                example: "62"
            },
            comment_id: {
                type: "string",
                description: "The id of the comment",
                example: "12"
            },
            username: {
                type: "string",
                description: "The username",
                example: "gerard.madrid"
            },
            post_id: {
                type: "number",
                description: "The id of the post",
                example: "73"
            },
            order_by: {
                type: "string",
                description: "The order of the posts",
                example: "likes"
            },
            post: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        description: "The title of the post",
                        example: "Hackernews pero encara més cutre"
                    },
                    url: {
                        type: "string",
                        description: "This is the url of the post",
                        example: "https://www.tomorrowtides.com/hackernews2.html"
                    },
                    msg: {
                        type: "string",
                        description: "This is the message of the post",
                        example: "Si hackernews ja era cutre, mireu la segona part."
                    },
                    username: {
                        type: "string",
                        description: "This is the username of the commentor",
                        example: "gerard.madrid"
                    }
                }
            },
            comment: {
                type: "object",
                properties: {
                    postId: {
                        type: "number",
                        description: "The id of the post",
                        example: "73"
                    },
                    parentId: {
                        type: "number",
                        description: "The id of the parent comment",
                        example: "1"
                    },
                    message: {
                        type: "string",
                        description: "This is the msg of the post",
                        example: "Això es un comentari, i tu?"
                    },
                    username: {
                        type: "string",
                        description: "This is the username of the commentor",
                        example: "gerard.madrid"
                    }
                }
            },
            user: {
                type: "object",
                properties: {
                    username: {
                        type: "string",
                        description: "The id of the user",
                        example: "gerard.madrid"
                    },
                    aboutMe: {
                        type: "string",
                        description: "A brief description of the user",
                        example: "I am a FIBer doing my ASW Project"
                    },
                    phone: {
                        type: "number",
                        description: "The user's phone number",
                        example: "684123807"
                    },
                    linkedIn: {
                        type: "string",
                        description: "The user's linkedIn account",
                        example: "https://www.linkedin.com/in/gerard-madrid/"
                    },
                    github: {
                        type: "string",
                        description: "The user's github account",
                        example: "https://github.com/gerardm27"
                    }
                }
            },
        }
    }
}