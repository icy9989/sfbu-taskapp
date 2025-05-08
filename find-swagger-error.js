const swaggerJSDoc = require("swagger-jsdoc");
const glob = require("glob");

const files = glob.sync("./app/api/**/*.js"); // or .ts if you use TypeScript

const definition = {
  openapi: "3.0.0",
  info: {
    title: "Swagger Test",
    version: "1.0.0",
  },
};

console.log("🔍 Scanning API files for Swagger parsing errors...");

files.forEach((file) => {
  try {
    swaggerJSDoc({
      definition,
      apis: [file],
    });
    console.log(`✅ Passed: ${file}`);
  } catch (err) {
    console.error(`❌ Failed: ${file}`);
    console.error(err.message);
  }
});
