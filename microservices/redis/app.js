const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const formidable = require("express-formidable");
const socketio = require('socket.io');
const routes = require("./routers");  // Import all routes as a single object
const appConfig = require('./middleware/config/app-config.js');  // Replace with your actual auth middleware
const authenticateGateway = require('./middleware/authenticateGateway');  // Replace with your actual auth middleware

// Initialize Express and Socket.IO
const app = express();
const PORT = process.env.PORT || 5397;
const apiPrefix = appConfig.prefix;  // Set your API prefix here

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Custom Middleware for Formidable and Body Parser
app.use((req, res, next) => {
  const host = req.get("host");

  // Only allow requests from localhost
  if (host === `localhost:${PORT}` || host === `127.0.0.1:${PORT}`) {
    next();
  } else {
    res.status(403).send("Only requests from localhost are allowed.");
  }
});

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
app.use(authenticateGateway);

// Routes
Object.keys(routes).forEach(route => {
  app.use(apiPrefix, routes[route]);
});

// Server Initialization
const server = app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});

// Socket.IO
const io = socketio(server);
app.set("socketio", io);

io.on('connection', (socket) => {
  console.log('a user connected');
});
