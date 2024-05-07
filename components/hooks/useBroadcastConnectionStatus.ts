import { useEffect } from "react";

export default function useBroadcastConnectionStatus(props) {
  const { session, status, socket, socketConnected } = props;

  let interval = null;

  const broadcastConnectionStatusInterval = (seconds: Number) => {
    console.log("broadcasting connection status from interval")
    // console.log("broadcasting connection status from interval");
    if (!interval) {
      interval = setInterval(() => {
        // console.log("broadcasting connection status from interval");
        socket.emit("broadcastConnectionStatus", {
          userId: session.user.id,
          name: session.user.name,
          status: "online",
        });
      }, seconds * 1000);
    }
  };

  useEffect(() => {
    if (socketConnected && status === "authenticated") {
      socket.on("joinedRooms", () => {
        broadcastConnectionStatusInterval(3);
      });
    }

  }, [socketConnected, status, socket, session]);


}
