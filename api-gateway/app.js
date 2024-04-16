/*
Access microservice server
*/

// Dependencies
const socketio = require("socket.io");

// Initialize
const app = require("./express");
const PORT = process.env.PORT || 5001;

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
