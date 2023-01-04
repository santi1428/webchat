import { useSession } from "next-auth/react";
import { useSocketStore } from "../../lib/store";
import { useEffect } from "react";

export default function useBroadcastConnectionStatus() {
  const { data: session, status } = useSession();
  const socket = useSocketStore((state) => state.socket);
  const socketConnected = useSocketStore((state) => state.socketConnected);

  const broadcastConnectionStatusEveryTenSeconds = () => {
    console.log("broadcasting connection status from interval");
    const interval = setInterval(() => {
      console.log("broadcasting connection status from interval");
      socket.emit("broadcastConnectionStatus", {
        userId: session.user.id,
        status: "online",
      });
    }, 10000);
  };

  useEffect(() => {
    if (socketConnected && status === "authenticated") {
      socket.on("joinedRooms", () => {
        broadcastConnectionStatusEveryTenSeconds();
      });
    }
  }, [socketConnected, status]);
}
