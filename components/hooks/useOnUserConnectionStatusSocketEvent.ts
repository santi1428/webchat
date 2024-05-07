import { useChatStore, useSocketStore } from "../../lib/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function useOnUserConnectionStatusSocketEvent(props) {
  const { status } = useSession();
  const { socket, socketConnected, setUsersConnectionStatus, usersConnectionStatus } = props;

  const addUsersConnectionStatus = (data) => {
    let newUsersConnectionStatus = [...usersConnectionStatus.filter((user) => user.userId !== data.userId), {
      userId: data.userId,
      status: data.status,
      name: data.name,
      time: Date.now(),
    }];
    setUsersConnectionStatus(newUsersConnectionStatus);
  };

  useEffect(() => {
    console.log(
      "usersConnectionStatus from useEffect on useOnUserConnectionStatusSocketEvent",
      usersConnectionStatus
    );
  }, [usersConnectionStatus]);

  useEffect(() => {
    if (socketConnected) {
      socket.on("userConnectionStatus", (data) => {
        if (status === "authenticated") {
          addUsersConnectionStatus(data);
        }
      });
    }
  }, [socketConnected, status, usersConnectionStatus]);
}
