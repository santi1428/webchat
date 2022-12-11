import Navbar from "./navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { useChatStore, useSocketStore } from "../lib/store";
import { useEffect } from "react";
import io from "socket.io-client";
import { useSession } from "next-auth/react";
import ChatMessageToast from "./chat/chatMessageToast";
import usePrefetchActiveChats from "./hooks/usePrefetchActiveChats";

export default function Layout({ children }): JSX.Element {
  const router = useRouter();

  const setSocket = useSocketStore((state) => state.setSocket);
  const socket = useSocketStore((state) => state.socket);
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const setSocketConnected = useSocketStore(
    (state) => state.setSocketConnected
  );
  const isNewMessageEventDeclared = useSocketStore(
    (state) => state.isNewMessageEventDeclared
  );
  const setIsNewMessageEventDeclared = useSocketStore(
    (state) => state.setIsNewMessageEventDeclared
  );
  const selectedChatUser = useChatStore((state) => state.selectedChat);
  const { status } = useSession();

  usePrefetchActiveChats();

  const socketInitializer = async () => {
    await fetch("/api/socket");
    setSocket(io());
  };

  useEffect(() => {
    if (socket) {
      socket.on("connect", (socket) => {
        console.log("connected");
        setSocketConnected(true);
      });
    }
    console.log("socket", socket);
  }, [socket]);

  useEffect(() => {
    if (!socket && status === "authenticated") {
      socketInitializer();
      console.log("Socket Initialized");

      // alert("socket initialized");
    }
  }, [socket, status]);

  const showMessageToast = (message) => {
    console.log("message", message);
    toast.custom(
      (t) => {
        console.log("toast t", t);
        return <ChatMessageToast message={message} t={t} />;
      },
      {
        duration: 5000,
      }
    );
  };

  useEffect(() => {
    if (
      socketConnected &&
      !isNewMessageEventDeclared &&
      status === "authenticated"
    ) {
      console.log("router path", router.asPath);
      console.log("declaring newMessageEvent");
      socket.on("newMessage", (message) => {
        console.log("newMessage", message);
        if (selectedChatUser.id !== message.senderId || router.asPath !== "/") {
          showMessageToast(message);
        }
      });
      setIsNewMessageEventDeclared(true);
    }
    console.log("isNewMessageEventDeclared", isNewMessageEventDeclared);
  }, [socketConnected, isNewMessageEventDeclared, router.asPath]);

  return (
    <>
      <div className="bg-background3" onClick={(e) => e.type}>
        <div className="scale-x-90 scale-y-95 rounded-3xl min-h-screen bg-background bg-cover bg-center relative">
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
    </>
  );
}
