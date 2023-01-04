import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import MutedActiveChatIcon from "../activechats/mutedactivechaticon";

export default function ChatHeader(props): JSX {
  const { selectedChatUser, resetSelectedChat } = props;

  return (
    <div className="flex flex-row border-b border-customBorderColor py-4">
      <div className="ml-6 inline-block h-9 w-9 relative self-center">
        <Image
          layout="fill"
          src={
            selectedChatUser.profilePhotoName.includes("http")
              ? selectedChatUser.profilePhotoName
              : "/images/" + selectedChatUser.profilePhotoName
          }
          className="rounded-full"
          alt="NoImage"
        />
      </div>
      <p className="flex flex-row  self-center text-bell pl-3 text-lg font-bold self-center">
        <span>
          {selectedChatUser.name} {selectedChatUser.lastName}
        </span>
        <MutedActiveChatIcon activeChat={selectedChatUser} iconColor="bell" />
      </p>
      <FontAwesomeIcon
        icon={faCircleXmark}
        size={"xl"}
        className="ml-auto mr-6 self-center text-bell cursor-pointer"
        onClick={() => resetSelectedChat()}
      />
    </div>
  );
}
