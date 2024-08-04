import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";

export default function useOnNewMessageSocketEvent(props) {
  const {
    selectedChat,
    socket,
    socketConnected,
    setScrollMessagesToBottom,
    queryClient,
    mutedUsers
  } = props;

  const { showMessageToast, session, status } = props;
  const router = useRouter();

  const showChatMessage = useCallback(
    (message) => {
      if (
        (selectedChat.id !== message.senderId || router.asPath !== "/") &&
        session?.user?.id !== message.senderId
      ) {
        showMessageToast(message);
      }
    },
    [selectedChat, router.asPath, showMessageToast]
  );

  useEffect(() => {
    if (socketConnected && socket && status === "authenticated") {
      // console.log("socket connected", socketConnected);
      // console.log("status", status);
      socket.on("newMessage", (message) => {
        console.log("newMessage", message);
        if (!mutedUsers.data.data.includes(message.senderId)) {
          showChatMessage(message);
        }    
        queryClient.invalidateQueries(["messages", message.senderId]);
        queryClient.invalidateQueries(["messages", selectedChat.id]);
        queryClient.invalidateQueries("activeChats");
        setScrollMessagesToBottom(true);
      });
    }
    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socketConnected, router.asPath, selectedChat, socket, mutedUsers]);
}
