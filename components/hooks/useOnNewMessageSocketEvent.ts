import { useEffect, useCallback, useState } from "react";
import { useNotificationStore, useSocketStore } from "../../lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

export default function useOnNewMessageSocketEvent(props) {
  const { selectedChat } = props;
  const socket = useSocketStore((state) => state.socket);
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const setScrollMessagesToBottom = useNotificationStore(
    (state) => state.setScrollMessagesToBottom
  );

  const { status } = useSession();
  const { showMessageToast } = props;
  const router = useRouter();

  const queryClient = useQueryClient();

  const showChatMessage = useCallback(
    (message) => {
      if (selectedChat.id !== message.senderId || router.asPath !== "/") {
        showMessageToast(message);
      }
    },
    [selectedChat, router.asPath, showMessageToast]
  );

  useEffect(() => {
    if (socketConnected && status === "authenticated") {
      socket.on("newMessage", (message) => {
        showChatMessage(message);
        queryClient.invalidateQueries(["messages", message.senderId]);
        queryClient.invalidateQueries("activeChats");
        setScrollMessagesToBottom(true);
      });
      return () => {
        socket.off("newMessage");
      };
    }
  }, [socketConnected, router.asPath, selectedChat, socket]);
}
