import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useChatStore } from "../../lib/store";
import { motion } from "framer-motion";

export default function ActiveChat(props): JSX {
  const { activeChat } = props;

  const selectedChat = useChatStore((state) => state.selectedChat);
  const changeSelectedChat = useChatStore((state) => state.changeSelectedChat);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0 }}
      key={activeChat.id === selectedChat.id ? 1 : 0}
      onClick={() => {
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
          <p
            className={`ml-5 text-bell font-semibold ${
              selectedChat.id === activeChat.id ? "text-background2" : ""
            }`}
          >
            {activeChat.name} {activeChat.lastName}
          </p>
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
            <a href="">
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size="lg"
                className={`pr-6 ${
                  selectedChat.id === activeChat.id
                    ? "text-background2"
                    : "text-bell"
                }`}
              />
            </a>
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
