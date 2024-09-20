import { useEffect } from "react";

export default function useBroadcastConnectionStatus(props) {
  const { session, socket, socketConnected } = props;

  useEffect(() => {
    let interval = null;
    if (socketConnected && socket) {
      interval = setInterval(() => {
        // console.log("broadcasting connection status from interval");
        socket.emit("broadcastConnectionStatus", {
          userId: session?.user?.id,
          name: session.user.name,
          profilePhotoURL: session.user.profilePhotoURL,
          status: "online",
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [socketConnected, socket]);
}
