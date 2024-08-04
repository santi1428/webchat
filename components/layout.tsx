import Navbar from "./navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import useInitSocket from "./hooks/useInitSocket";
import useOnNewMessageSocketEvent from "./hooks/useOnNewMessageSocketEvent";
import ChatMessageToast from "./chat/chatMessageToast";
import { useChatStore } from "../lib/store";
import { useSession } from "next-auth/react";
import useBroadcastConnectionStatus from "./hooks/useBroadcastConnectionStatus";
import useOnUserConnectionStatusSocketEvent from "./hooks/useOnUserConnectionStatusSocketEvent";
import { useQueryClient } from "react-query";
import { useSocketStore, useModalStore } from "../lib/store";
import useOnUserTypingEvent from "./hooks/useOnUserTypingEvent";
import useActiveChats from "./hooks/useActiveChats";
import useMutedUsers from "./hooks/useMutedUsers";
import { useNotificationStore } from "../lib/store";
import { useRef } from "react";
import BlockUserModal from "./blockUserModal";

export default function Layout({ children }): JSX.Element {
  const router = useRouter();

  const queryClient = useQueryClient();

  const selectedChat = useChatStore((state) => state.selectedChat);

  const audioRef = useRef();

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    } else {
      console.log("AUDIO REF NOT FOUND");
    }
  };

  const socket = useSocketStore((state) => state.socket);
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const setUsersConnectionStatus = useSocketStore(
    (state) => state.setUsersConnectionStatus
  );
  const usersConnectionStatus = useSocketStore(
    (state) => state.usersConnectionStatus
  );
  const activeUsers = useSocketStore((state) => state.activeUsers);
  const setActiveUsers = useSocketStore((state) => state.setActiveUsers);
  const timeToRefreshConnectionStatus = useSocketStore(
    (state) => state.timeToRefreshConnectionStatus
  );

  const usersTypingStatus = useSocketStore((state) => state.usersTypingStatus);
  const setUsersTypingStatus = useSocketStore(
    (state) => state.setUsersTypingStatus
  );
  const setActiveUsersTyping = useSocketStore(
    (state) => state.setActiveUsersTyping
  );
  const activeUsersTyping = useSocketStore((state) => state.activeUsersTyping);
  const timeToRefreshTypingStatus = useSocketStore(
    (state) => state.timeToRefreshTypingStatus
  );

  const { data: session, status } = useSession();

  const setSocket = useSocketStore((state) => state.setSocket);
  const setSocketConnected = useSocketStore(
    (state) => state.setSocketConnected
  );
  const getRoomID = useChatStore((state) => state.getRoomID);

  const mutedUsers = useMutedUsers({ status });

  const setScrollMessagesToBottom = useNotificationStore(
    (state) => state.setScrollMessagesToBottom
  );

  const showMessageToast = (message) => {
    playAudio();

    // console.log("message from showMessageToast", message);
    toast.custom(
      // @ts-ignore
      (t) => {
        // console.log("toast t", t);
        return <ChatMessageToast message={message} t={t} />;
      },
      {
        duration: 5000,
      }
    );
  };

  const { data, isFetched } = useActiveChats({ status });

  useInitSocket({
    socket,
    setSocket,
    setSocketConnected,
    socketConnected,
    status,
    data,
    isFetched,
    getRoomID,
    session,
  });

  useOnNewMessageSocketEvent({
    showMessageToast,
    selectedChat,
    session,
    status,
    socket,
    socketConnected,
    setScrollMessagesToBottom,
    queryClient,
    mutedUsers,
  });

  useBroadcastConnectionStatus({ session, status, socket, socketConnected });

  useOnUserConnectionStatusSocketEvent({
    socket,
    setUsersConnectionStatus,
    usersConnectionStatus,
    socketConnected,
    activeUsers,
    setActiveUsers,
    timeToRefreshConnectionStatus,
    session,
    status,
  });

  useOnUserTypingEvent({
    socket,
    socketConnected,
    status,
    session,
    usersTypingStatus,
    setUsersTypingStatus,
    setActiveUsersTyping,
    timeToRefreshTypingStatus,
    activeUsersTyping,
  });

  return (
    <>
      <div className="bg-background3" id="rootModal">
        <div className="md:scale-x-90 md:scale-y-95 sm:scale-x-100 sm:scale-y-100 md:rounded-3xl min-h-screen bg-background bg-cover bg-center relative overflow-y-hidden">
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              transition={{ duration: 0.2 }}
              initial="initialState"
              animate="animateState"
              exit="exitState"
              variants={{
                initialState: {
                  opacity: 0,
                  scale: 0,
                },
                animateState: { opacity: 1, scale: 1 },
                exitState: {
                  scale: 0,
                },
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#83F0FF",
              color: "#17181F",
              marginBottom: "15px",
            },
          },
          error: {
            style: {
              background: "#83F0FF",
              color: "#17181F",
            },
          },
        }}
      />
      <audio ref={audioRef} controls className="hidden">
        <source src="/sound/message-notification-sound.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </>
  );
}
