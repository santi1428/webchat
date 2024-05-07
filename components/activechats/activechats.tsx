import Image from "next/image";
import { useSession } from "next-auth/react";
import ActiveChat from "./activechat";
import ActiveChatsFilter from "./activeChatsFilter";
import { useChatStore, useSocketStore } from "../../lib/store";
import { useMemo } from "react";
import useActiveChats from "../hooks/useActiveChats";
import { AnimatePresence, motion } from "framer-motion";

export default function ActiveChats(props): JSX {
  const { data: session, status } = useSession();
  const activeChatsFilter = useChatStore((state) => state.activeChatsFilter);

  const { data } = useActiveChats({ status });

  const memoizedActiveChatsFiltered = useMemo(() => {
    return [...new Map(data?.data.map((item) => [item["id"], item])).values()]
      .filter(
        (chat) =>
          chat.id !== session?.user?.id &&
          (chat.lastMessage?.content
            .toLowerCase()
            .includes(activeChatsFilter.toLowerCase()) ||
            chat.name.toLowerCase().includes(activeChatsFilter.toLowerCase()) ||
            chat.lastName
              .toLowerCase()
              .includes(activeChatsFilter.toLowerCase()))
      )
      .slice(0)
      .sort((a, b) => {
        return (
          new Date(b.lastMessage?.createdAt).getTime() -
          new Date(a.lastMessage?.createdAt).getTime()
        );
      });
  }, [JSON.stringify(data?.data), activeChatsFilter]);

  return (
    <div className="min-h-[calc(100vh-73.5px)] max-h-[calc(100vh-73.5px)] col-span-4 flex flex-col border-r border-customBorderColor overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-bell scrollbar-track-background">
      <ActiveChatsFilter />
      <h3 className="hidden md:block ml-7 mt-6 text-bell text-lg font-semibold ">
        Active now
      </h3>
      <div className="hidden md:grid grid-cols-5 justify-items-center mt-5 pl-0 pb-5 border-b border-customBorderColor ">
        <div className="inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie1.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="mr-3 inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie2.jpeg"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="mr-3 inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie3.jpg"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="mr-3 inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie4.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="mr-3 inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
      </div>

      {/*Seccion de lista de chats*/}

      {memoizedActiveChatsFiltered.map((chat) => (
        <ActiveChat key={chat.id} activeChat={chat} />
      ))}

      {data?.data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full ">
          <h3 className="text-bell text-lg font-semibold">
            No active chats found
          </h3>
          <h3 className="text-bell text-sm md:text-lg font-semibold">
            Start a new conversation
          </h3>
        </div>
      )}

      <AnimatePresence mode={"wait"}>
        {memoizedActiveChatsFiltered.length === 0 &&
          activeChatsFilter.trim() !== "" &&
          data?.data.length > 0 && (
            <motion.div
              key={memoizedActiveChatsFiltered.length}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ scale: 0 }}
              className="flex flex-col justify-center items-center h-full"
            >
              <h3 className="text-bell text-lg font-semibold">
                No chats found
              </h3>
              <p className="text-bell text-sm font-semibold">
                Try searching for a different name
              </p>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
