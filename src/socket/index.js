import { handleConnection } from "./socketHandlers.js";

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => handleConnection(io, socket));
};