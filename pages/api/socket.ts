import { Server } from "Socket.IO";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

const getLoggedUserID = (req, res) => {
  const session = unstable_getServerSession(req, res, authOptions);
  return session;
};

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    // @ts-ignore
    io.on("connect", (socket) => {
      socket.on("joinRooms", async (rooms) => {
        console.log("This is the test of nodemon");
        for (const room of rooms) {
          if (!socket.rooms.has(room)) {
            console.log("Joining room " + room);
            await socket.join(room);
          }
        }
        socket.emit("joinedRooms");
      });

      socket.on("broadcastConnectionStatus", async (user) => {
        console.log("Broadcasting connection status for userId", user);
        socket.broadcast.emit("userConnectionStatus", user);
      });

      socket.on("sendMessage", async (message) => {
        console.log(
          "Sending message: " + message.message,
          "to room: " + message.roomID
        );
        // @ts-ignore
        socket.broadcast.to(message.roomID).emit("newMessage", message);
      });

      socket.on("disconnecting", () => {
        console.log("Socket disconnected", socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;
