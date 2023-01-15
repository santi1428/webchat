import { useEffect } from "react";
import { useChatStore, useSocketStore } from "../../lib/store";
import { useSession } from "next-auth/react";

export default function useJoinRooms(props) {
  const { isFetched, data } = props;
  const getRoomID = useChatStore((state) => state.getRoomID);
  const hasJoinedRooms = useSocketStore((state) => state.hasJoinedRooms);
  const setHasJoinedRooms = useSocketStore((state) => state.setHasJoinedRooms);
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const socket = useSocketStore((state) => state.socket);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      !hasJoinedRooms &&
      socketConnected &&
      status === "authenticated" &&
      isFetched
    ) {
      socket.emit(
        "joinRooms",
        data?.data?.map((activeChat) =>
          getRoomID(session.user.id, activeChat.id)
        )
      );
      setHasJoinedRooms(true);
    }
  }, [socketConnected, status, hasJoinedRooms, isFetched]);
}
