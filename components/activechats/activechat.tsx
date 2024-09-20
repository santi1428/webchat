import dayjs from "dayjs";
import Image from "next/image";
import { useChatStore } from "../../lib/store";
import { AnimatePresence, motion } from "framer-motion";
import OptionsMenu from "./optionsmenu/optionsmenu";
import MutedActiveChatIcon from "./mutedactivechaticon";
import ConnectionStatusIcon from "./connectionStatusIcon";
import TypingStatusText from "./typingStatusText";

export default function ActiveChat(props): JSX.Element{
  const { activeChat } = props;

  const selectedChat = useChatStore((state : any) => state.selectedChat);
  const changeSelectedChat = useChatStore((state: any) => state.changeSelectedChat);

  const checkIfDateIsToday = (date) => {
    return dayjs(date).isSame(dayjs(), "day");
  };

  return (
    <div
      onClick={() => {
        changeSelectedChat(activeChat);
      }}
      className={`flex flex-col py-3 md:flex-row md:py-4 cursor-pointer ${
        activeChat.id === selectedChat.id ? "bg-bell text-background2" : ""
      }`}
    >
      <div className="self-center md:self-auto md:ml-6 inline-block h-10 w-10 md:h-12 md:w-12 relative">
        <Image
          layout="fill"
          src={
            activeChat.profilePhotoName
          }
          className="rounded-full"
          alt="NoImage"
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:pb-1">
          <div className="flex flex-row justify-center md:justify-normal">
            <p
              className={`font-semibold capitalize text-sm md:text-lg md:ml-5 text-center md:text-left  ${
                selectedChat.id === activeChat.id
                  ? "text-background2"
                  : "text-bell"
              }`}
            >
              {activeChat.name} {activeChat.lastName}
            </p>
            <ConnectionStatusIcon activeChat={activeChat} />
            <TypingStatusText
              activeChat={activeChat}
              style={`${
                selectedChat.id !== activeChat.id
                  ? "text-white"
                  : "text-background2 font-bold"
              } text-xs md:text-base md:ml-2`}
            />
            <MutedActiveChatIcon activeChat={activeChat} />
          </div>
          <div className="relative flex flex-row justify-center md:justify-normal">
            <p
              className={`md:mr-4 text-sm md:text-md ${
                selectedChat.id === activeChat.id
                  ? "text-background2"
                  : "text-bell"
              }`}
            >
              {checkIfDateIsToday(activeChat.lastMessage?.createdAt)
                ? dayjs(activeChat.lastMessage?.createdAt).format("h:mm A")
                : dayjs(activeChat.lastMessage?.createdAt).format("DD/MM/YYYY")}
            </p>
            <OptionsMenu activeChat={activeChat} />
          </div>
        </div>
        <AnimatePresence mode={"wait"}>
          <motion.p
            key={activeChat.lastMessage?.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className={`md:ml-5 text-center text-sm sm:text-md md:text-start max-w-2xl ${
              selectedChat.id === activeChat.id
                ? "text-background2"
                : "text-bell"
            } z-0`}
          >
            {activeChat.lastMessage?.content.length > 50
              ? activeChat.lastMessage?.content.substring(0, 50) + "..."
              : activeChat.lastMessage?.content}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
