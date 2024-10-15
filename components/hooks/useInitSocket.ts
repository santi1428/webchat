import io from "socket.io-client";
import { useEffect } from "react";

import toast from "react-hot-toast";

export default function useInitSocket(props) {
  const {
    socket,
    socketConnected,
    setSocket,
    setSocketConnected,
    status,
    isFetched,
    data,
    getRoomID,
    session,
    setJoinedRooms,
  } = props;

  const socketInitializer = async () => {
    await fetch("/api/socket");
    setSocket(io());
  };

  useEffect(() => {
    if (!socket && status === "authenticated" && isFetched) {
      socketInitializer();
      // console.log("Socket Initialized");
    }
  }, [socket, status, isFetched]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", (s) => {
        setSocketConnected(true);
        const newJoinedRooms = data?.data?.map((activeChat) =>
          getRoomID(session?.user?.id, activeChat.id)
        );
        socket.emit("joinRooms", newJoinedRooms);
        setJoinedRooms(newJoinedRooms);
      });

      socket.on("reconnect", () => {
        toast.success("Reconnected to the server.", {
          duration: 10000,
        });
      });

      socket.on("disconnect", () => {
        setSocketConnected(false);
      });
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
      }
    };
  }, [socket]);
}
