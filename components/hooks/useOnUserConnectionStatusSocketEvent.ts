import { useChatStore, useSocketStore } from "../../lib/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useOnUserConnectionStatusSocketEvent() {
  const socket = useSocketStore((state) => state.socket);
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const setUsersConnectionStatus = useSocketStore(
    (state) => state.setUsersConnectionStatus
  );
  const usersConnectionStatus = useSocketStore(
    (state) => state.usersConnectionStatus
  );

  const { status } = useSession();

  const addUsersConnectionStatus = (data) => {
    console.log("Adding user connection status", data);
    if (!usersConnectionStatus.find((user) => data.userId === user.userId)) {
      setUsersConnectionStatus([...usersConnectionStatus, data]);
    }
  };

  useEffect(() => {
    console.log(
      "usersConnectionStatus from useEffect on useOnUserConnectionStatusSocketEvent",
      usersConnectionStatus
    );
  }, [usersConnectionStatus]);

  useEffect(() => {
    if (socketConnected && status === "authenticated") {
      socket.on("userConnectionStatus", (data) => {
        console.log(
          "userConnectionStatus from useOnUserConnectionStatusSocketEvent",
          data
        );
        addUsersConnectionStatus(data);
      });
    }
  }, [socketConnected, status]);
}
