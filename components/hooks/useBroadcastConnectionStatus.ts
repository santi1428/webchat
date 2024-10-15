import { useEffect } from "react";

export default function useBroadcastConnectionStatus(props) {
  const { session, socket, socketConnected, joinedRooms, status } = props;

  useEffect(() => {
    let interval = null;
    if (
      socketConnected &&
      socket &&
      status === "authenticated" &&
      session?.user
    ) {
      interval = setInterval(() => {
        console.log("status", status);

        // console.log("broadcasting connection status from interval");
        socket.emit("broadcastConnectionStatus", {
          userId: session.user.id,
          name: session.user.name,
          lastName: session.user.lastName,
          profilePhotoURL: session.user.profilePhotoURL,
          status: "online",
          joinedRooms,
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [socketConnected, socket, status, joinedRooms, session]);
}
