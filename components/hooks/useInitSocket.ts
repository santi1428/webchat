import { useSocketStore } from "../../lib/store";
import io from "socket.io-client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";


export default function useInitSocket() {
  const socket = useSocketStore((state) => state.socket);
  const setSocket = useSocketStore((state) => state.setSocket);
  const setSocketConnected = useSocketStore(
    (state) => state.setSocketConnected
  );
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const { status } = useSession();

  const socketInitializer = async () => {
    await fetch("/api/socket");
    setSocket(io());
  };

  useEffect(() => {
    if (!socket && !socketConnected && status === "authenticated") {
      socketInitializer();
      // console.log("Socket Initialized");
    }

    if (socket) {
      socket.on("connect", (s) => {
        // console.log("connected");
        setSocketConnected(true);
        // console.log("connected");
      });

      socket.on("disconnect", () => {
        // console.log("disconnected");
        setSocketConnected(false);
      });

    }
  }, [socket, status, setSocketConnected, socketConnected]);

  useEffect(() => {
    if (socketConnected){
      toast.success(`Connected to server status:${status} socket:${socket}`, {
        duration: 10000,
      });
    }else{
      toast.error(`Disconnected from server status:${status} socket:${socket}`, {
        duration: 10000,
      });
    }

  }, [socketConnected]);



}
