import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import MutedActiveChatIcon from "../activechats/mutedactivechaticon";
import ConnectionStatusIcon from "../activechats/connectionStatusIcon";
import TypingStatusText from "../activechats/typingStatusText";

export default function ChatHeader(props): JSX.Element {
  const { selectedChatUser, resetSelectedChat } = props;

  return (
    <div className="flex flex-row border-b border-customBorderColor py-4">
      <div className="md:ml-6 ml-3 inline-block h-8 w-8 md:h-9 md:w-9 relative self-center">
        <Image
          layout="fill"
          src={selectedChatUser.profilePhotoURL}
          className="rounded-full"
          alt="NoImage"
        />
      </div>
      <div className="flex flex-row pl-1 md:self-center text-bell md:pl-3 text-lg font-bold">
        <span className="capitalize text-sm self-center md:text-lg">
          {selectedChatUser.name} {selectedChatUser.lastName}
        </span>
        <MutedActiveChatIcon activeChat={selectedChatUser} iconColor="bell" />
        <ConnectionStatusIcon activeChat={selectedChatUser} />
        <TypingStatusText
          activeChat={selectedChatUser}
          style={"ml-2 text-xs md:text-base self-center"}
        />
      </div>
      <FontAwesomeIcon
        icon={faCircleXmark}
        size={"xl"}
        className="ml-auto mr-6 self-center text-bell cursor-pointer"
        onClick={() => resetSelectedChat()}
      />
    </div>
  );
}
