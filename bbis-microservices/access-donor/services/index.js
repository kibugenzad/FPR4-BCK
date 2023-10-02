/*
all services
*/

const fs = require("fs");
const path = require("path");

const servicesPath = __dirname;

// Read all files in the directory
const files = fs.readdirSync(servicesPath);

const toPascalCase = (str) => {
  return (
    str
      // Split the string on "-" or "_"
      .split(/[-_]/)
      // Map through the parts and capitalize the first letter of each part
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      // Join the parts back together
      .join("")
  );
};

// Import each service and add it to the exports object if it's a function
const services = {};
files.forEach((file) => {
  // Filter out the current file (index.js) and any non-JavaScript files
  if (file !== "index.js" && file.endsWith(".js")) {
    let serviceName = path.basename(file, ".js"); // remove the file extension to get the service name
    const service = require(`./${serviceName}`);

    // Check if the imported module is a function (middleware)
    if (typeof service === "function") {
      serviceName = toPascalCase(serviceName);
      services[serviceName] = service;
      console.log("Added service:", serviceName);
    } else {
      console.log("Skipping Non-function:", serviceName);
    }
  }
});

module.exports = services;
