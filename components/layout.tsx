import Navbar from "./navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import useActiveChats from "./hooks/useActiveChats";
import useJoinRooms from "./hooks/useJoinRooms";
import useInitSocket from "./hooks/useInitSocket";
import useOnNewMessageSocketEvent from "./hooks/useOnNewMessageSocketEvent";
import ChatMessageToast from "./chat/chatMessageToast";
import { useChatStore } from "../lib/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Layout({ children }): JSX.Element {
  const router = useRouter();

  const { status } = useSession();

  const selectedChat = useChatStore((state) => state.selectedChat);

  const showMessageToast = (message) => {
    console.log("message", message);
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

  useInitSocket();

  useOnNewMessageSocketEvent({ showMessageToast, selectedChat });

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
