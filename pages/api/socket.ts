import { Server } from "socket.io";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

const getLoggedUserID = (req, res) => {
  const session = getServerSession(req, res, authOptions);
  return session;
};

function isIterable(variable) {
  return variable != null && typeof variable[Symbol.iterator] === "function";
}

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
        const joinedRooms = user.joinedRooms;
        delete user.joinedRooms;
        if (isIterable(joinedRooms)) {
          for (const room of joinedRooms) {
            // console.log(
            //   `${user.name} is broadcasting connection status to room ${room}`
            // );
            socket.to(room).emit("userConnectionStatus", user);
          }
        } else {
          console.log("JoinedRooms are not iterable", typeof joinedRooms);
        }
      });

      socket.on("sendMessage", async (message) => {
        // console.log(
        //   "Sending message: " + message.message,
        //   "to room: " + message.roomID
        // );
        // @ts-ignore
        io.to(message.roomID).emit("newMessage", message);
      });

      socket.on("typing", async (data) => {
        // console.log("User is typing", data);
        socket.to(data.roomID).emit("userTyping", data);
      });

      socket.on("disconnecting", () => {
        console.log("Socket disconnected", socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;
