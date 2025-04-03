import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let activeUsers = [];

io.on("connection", (socket) => {
  console.log(` User connected: ${socket.id}`);


  socket.on("joinChat", ({ user, email }) => {
    if (!activeUsers.some((u) => u.email === email)) {
      activeUsers.push({ socketId: socket.id, user, email });
    }
    io.emit("activeUsers", activeUsers);
  });

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((u) => u.socketId !== socket.id);
    io.emit("activeUsers", activeUsers);
    console.log(` User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => console.log(" WebSocket Server running on port 3001"));
