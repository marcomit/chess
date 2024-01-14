import { Server } from "socket.io";
import * as http from "http";
import express from "express";
import { emitSocketServer, onSocketServer } from "./utils";

const server = http.createServer(express());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connect", (socket) => {
  socket.on("connect", () =>
    socket.emit("clients", socket.rooms.values.length),
  );
  socket.on("disconnect", () => {
    socket.emit("user_disconnected");
  });

  onSocketServer(socket, "friend", "send", (data) => {
    emitSocketServer(socket, "friend", "send", data, data.receiverId);
  })

  onSocketServer(socket, "game", "search", (data) => {
    emitSocketServer(socket, "game", "search", data);
  });

  onSocketServer(socket, "game", "sendUserInfo", (data) => {
    emitSocketServer(socket, "game", "sendUserInfo", data);
  });

  onSocketServer(socket, "game", "join", (data) => {
    void socket.join(data);
  });

  onSocketServer(socket, "game", "leave", (data) => {
    void socket.leave(data);
  });

  onSocketServer(socket, "game", "move", (data) => {
    emitSocketServer(socket, "game", "move", data, data.gameId);
  });
});

server.listen(8080, () => {
  console.log("✔️  Server listening on port 8080");
});
