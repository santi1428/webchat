import { Server } from "socket.io";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const getLoggedUserID = (req, res) => {
  const session = getServerSession(req, res, authOptions);
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
        for (const room of rooms) {
          if (!socket.rooms.has(room)) {
            console.log("Joining room " + room);
            await socket.join(room);
          }
        }
        socket.emit("joinedRooms");
      });

      socket.on("broadcastConnectionStatus", async (user) => {
        // console.log(`${user.name} is broadcasting connection status`);
        socket.broadcast.emit("userConnectionStatus", user);
      });

      socket.on("sendMessage", async (message) => {
        console.log(
          "Sending message: " + message.message,
          "to room: " + message.roomID
        );
        // @ts-ignore
        io.to(message.roomID).emit("newMessage", message);
      });

      socket.on("typing", async (data) => {
        console.log("User is typing", data);
        // @ts-ignore
        socket.broadcast.to(data.roomID).emit("userTyping", data);
      });

      socket.on("disconnecting", () => {
        console.log("Socket disconnected", socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;
