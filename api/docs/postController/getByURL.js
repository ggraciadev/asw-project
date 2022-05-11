module.exports = {
  get: {
    tags: ["Post controller"],
    description: "Get a post by the URL",
    operationId: "getByURL",
    parameters: [
      {
        name: "url",
        in: "query",
        schema: {
          $ref: "#/components/schemas/url",
        },
        required: true,
        description: "The post URL",
      },
    ],
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {},
        },
      },
      404: {
        description: "URL not found",
      },
      500: {
        description: "Internal server error",
      },
    },
  },
};
