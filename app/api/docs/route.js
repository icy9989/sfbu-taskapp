import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "My Next.js API", // API Title
      version: "1.0.0", // API Version
      description: "This is the API documentation for my Next.js project.", // API Description
    },
  },
  apis: ["./app/api/**/*.js"], // Path to the API files you want to document
};

// Generate the Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

export async function GET(req, res) {
  // Serve the Swagger UI
  return swaggerUi.setup(swaggerSpec)(req, res);
}

