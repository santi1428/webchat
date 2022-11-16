import { Server } from "Socket.IO";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connect", (socket) => {
      socket.on("test", (msg) => {
        // socket.broadcast.emit("update-input", msg);
        console.log("Message received: " + msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;
