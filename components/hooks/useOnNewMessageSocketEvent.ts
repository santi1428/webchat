import { useEffect, useCallback, useState } from "react";
import { useNotificationStore, useSocketStore } from "../../lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import useSound from "use-sound";

export default function useOnNewMessageSocketEvent(props) {
  const { selectedChat, mutedUsers } = props;
  console.log("Selected Chat on useOnNewMessageSocketEvent: ", selectedChat);
  const socket = useSocketStore((state) => state.socket);
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const setScrollMessagesToBottom = useNotificationStore(
    (state) => state.setScrollMessagesToBottom
  );
  const [play] = useSound("/sound/message-notification-sound.mp3", {
    volume: 0.25,
  });
  const [displayChatMessage, setDisplayChatMessage] = useState(null);

  useEffect(() => {
    if (displayChatMessage) {
      showMessageToast(displayChatMessage);
      play();
    }
    setDisplayChatMessage(null);
  }, [displayChatMessage]);

  const { status } = useSession();
  const { showMessageToast } = props;
  const router = useRouter();

  const queryClient = useQueryClient();

  const showChatMessage = useCallback(
    (message) => {
      console.log("newMessage", message);
      console.log(
        "selectedChat.id !== message.senderId",
        selectedChat.id !== message.senderId
      );
      console.log("selectedChat", selectedChat);
      console.log("message.senderId", message.senderId);
      console.log(
        "!mutedUsers.data.includes(message.senderId)",
        !mutedUsers.data.includes(message.senderId)
      );
      console.log("mutedUsers.data", mutedUsers.data);
      console.log("message.senderId", message.senderId);
      if (
        (selectedChat.id !== message.senderId || router.asPath !== "/") &&
        !updatedMutedUsers?.data?.includes(message.senderId)
      ) {
        showMessageToast(message);
        play();
      }
    },
    [selectedChat, router.asPath, JSON.stringify(mutedUsers)]
  );

  useEffect(() => {
    if (socketConnected && status === "authenticated") {
      console.log("router path", router.asPath);
      console.log("declaring newMessageEvent");
      socket.on("newMessage", (message) => {
        setDisplayChatMessage(message);
        // showChatMessage(message);
        queryClient.invalidateQueries(["messages", selectedChat.id]);
        queryClient.invalidateQueries("activeChats");
        setScrollMessagesToBottom(true);
      });
      return () => {
        socket.off("newMessage");
      };
    }
  }, [socketConnected, router.asPath, selectedChat]);
}
