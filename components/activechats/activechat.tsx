import dayjs from "dayjs";
import Image from "next/image";
import { useChatStore } from "../../lib/store";
import { motion } from "framer-motion";
import OptionsMenu from "./optionsmenu";
import { useMemo } from "react";
import MutedActiveChatIcon from "./mutedactivechaticon";

export default function ActiveChat(props): JSX {
  const { activeChat, mutedUsers } = props;

  const selectedChat = useChatStore((state) => state.selectedChat);
  const changeSelectedChat = useChatStore((state) => state.changeSelectedChat);
  const isUserMutedMemoized = useMemo(() => {
    return mutedUsers.includes(activeChat.id);
  }, [mutedUsers, activeChat.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0 }}
      key={activeChat.id === selectedChat.id ? 1 : 0}
      onClick={() => {
        console.log("activeChat", activeChat);
        changeSelectedChat(activeChat);
      }}
      className={`flex flex-row py-4 cursor-pointer ${
        activeChat.id === selectedChat.id ? "bg-bell text-background2" : ""
      }`}
    >
      <div className="ml-7 inline-block h-12 w-12 relative">
        <Image
          layout="fill"
          src={
            activeChat.profilePhotoName.includes("http")
              ? activeChat.profilePhotoName
              : "/images/" + activeChat.profilePhotoName
          }
          className="rounded-full"
          alt="NoImage"
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between pb-1">
          <div className="flex flex-row">
            <p
              className={`ml-5 text-bell font-semibold ${
                selectedChat.id === activeChat.id ? "text-background2" : ""
              }`}
            >
              {activeChat.name} {activeChat.lastName}
            </p>
            <MutedActiveChatIcon
              activeChat={activeChat}
              isUserMutedMemoized={isUserMutedMemoized}
            />
          </div>
          <div className="flex flex-row">
            <p
              className={`mr-4 ${
                selectedChat.id === activeChat.id
                  ? "text-background2"
                  : "text-bell"
              }`}
            >
              {dayjs(activeChat.lastMessage?.createdAt).format("h:mm A")}
            </p>
            <OptionsMenu
              activeChat={activeChat}
              isUserMutedMemoized={isUserMutedMemoized}
            />
          </div>
        </div>
        <p
          className={`ml-5 max-w-2xl ${
            selectedChat.id === activeChat.id ? "text-background2" : "text-bell"
          }`}
        >
          {activeChat.lastMessage?.content.length > 50
            ? activeChat.lastMessage?.content.substring(0, 50) + "..."
            : activeChat.lastMessage?.content}
        </p>
      </div>
    </motion.div>
  );
}