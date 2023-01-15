import { useSession } from "next-auth/react";
import { useSocketStore } from "../../lib/store";
import { useEffect } from "react";

export default function useBroadcastConnectionStatus() {
  const { data: session, status } = useSession();
  const socket = useSocketStore((state) => state.socket);
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const setUsersConnectionStatus = useSocketStore(
    (state) => state.setUsersConnectionStatus
  );

  const broadcastConnectionStatusInterval = (seconds: Number) => {
    console.log("broadcasting connection status from interval");
    const interval = setInterval(() => {
      console.log("broadcasting connection status from interval");
      socket.emit("broadcastConnectionStatus", {
        userId: session.user.id,
        status: "online",
      });
    }, seconds);
  };

  const cleanConnectionStatusInterval = (seconds: Number) => {
    const interval = setInterval(() => {
      setUsersConnectionStatus([]);
    }, seconds);
  };

  useEffect(() => {
    if (socketConnected && status === "authenticated") {
      socket.on("joinedRooms", () => {
        broadcastConnectionStatusInterval(10000);
      });
    }
  }, [socketConnected, status]);

  useEffect(() => {
    const broadcastConnectionStatusBeforeUnload = (e) => {
      console.log("broadcasting connection status before unload");
      socket.emit("broadcastConnectionStatus", {
        userId: session.user.id,
        status: "offline",
      });
    };

    window.addEventListener(
      "beforeunload",
      broadcastConnectionStatusBeforeUnload
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        broadcastConnectionStatusBeforeUnload
      );
  }, [socket]);
}
