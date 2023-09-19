/*
Access microservice server
*/

// Dependencies
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const formidable = require("express-formidable");
const { generateKeys } = require("./commons/utils/gen-keys");
const socketio = require("socket.io");
const { tokenVerify } = require("./commons/middleware/authentication");
const appConfig = require("./commons/config/app-config");
const routes = require("./routers"); // Import all routes as a single object

// Initialize
const app = express();
const PORT = process.env.PORT || 3357;
const apiPrefix = appConfig.apiPrefix;
generateKeys();

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  const hasJsonContent = contentType.includes("application/json");

  if (!hasJsonContent && !(req.body && Object.keys(req.body).length > 0)) {
    formidable()(req, res, next);
  } else {
    next();
  }
});

// Authentication
// app.use(tokenVerify);

// Routes
Object.keys(routes).forEach((route) => {
  app.use(apiPrefix, routes[route]);
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(422).send({ error: err.message });
});

// Server Initialization
const server = app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});

// Socket.IO
const io = socketio(server);
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("user_info", (data) => {
    console.log(`User connected id: ${data.id}`);
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
