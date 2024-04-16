/*
all routers
*/

const fs = require("fs");
const path = require("path");

const routersPath = __dirname;

// Read all files in the directory
const files = fs.readdirSync(routersPath);

// Import each router and add it to the exports object if it's a function
const routers = {};
files.forEach((file) => {
  // Filter out the current file (index.js) and any non-JavaScript files
  if (file !== "index.js" && file.endsWith(".js")) {
    const routerName = path.basename(file, ".js"); // remove the file extension to get the router name
    const router = require(`./${routerName}`);

    // Check if the imported module is a function (middleware)
    if (typeof router === "function") {
      routers[routerName] = router;
      console.log("Added Router:", routerName);
    } else {
      console.log("Skipping Non-function:", routerName);
    }
  }
});

module.exports = routers;
