import { useSocketStore } from "../../lib/store";
import io from "socket.io-client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function useInitSocket() {
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const setSocketConnected = useSocketStore(
    (state) => state.setSocketConnected
  );
  const { status } = useSession();

  const socketInitializer = async () => {
    await fetch("/api/socket");
    setSocket(io());
  };

  useEffect(() => {
    if (!socket && status === "authenticated") {
      socketInitializer();
      console.log("Socket Initialized");
    }

    if (socket) {
      socket.on("connect", (socket) => {
        console.log("connected");
        setSocketConnected(true);
      });
    }
  }, [socket, status]);
}
