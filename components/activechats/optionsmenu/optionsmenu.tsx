import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatStore } from "../../../lib/store";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import MutedUser from "./muteduser";
import BlockedUser from "./blockeduser";


export default function OptionsMenu(props): JSX {
  const selectedChat = useChatStore((state) => state.selectedChat);
  
  const { activeChat } = props;

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuButtonRef = useRef(null);

  useOnClickOutside(optionsMenuButtonRef, () => {
    setShowOptionsMenu(false);
  });

  return (
    <div
      className="relative left-4 md:left-0 block"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        ref={optionsMenuButtonRef}
        className="cursor-pointer md:pl-2"
        onClick={(e) => {
          e.stopPropagation();
          setShowOptionsMenu(!showOptionsMenu);
        }}
      >
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          size="xl"
          className={`md:pr-6 ${
            selectedChat.id === activeChat.id ? "text-background2" : "text-bell"
          }`}
        />
      </div>
      <AnimatePresence mode={"wait"}>
        {showOptionsMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0, scale: 0 }}
            key={showOptionsMenu ? 1 : 0}
            className={`absolute max-w-28 md:max-w-48 py-2 pr-2 md:py-0 -right-1 md:right-8 md:top-6 flex flex-col rounded-l-md rounded-br-md drop-shadow-2xl ${
              selectedChat.id === activeChat.id
                ? "bg-background2 text-bell"
                : "bg-bell text-background2"
            } w-48`}
          >
            <MutedUser
              activeChat={activeChat}
              showOptionsMenu={showOptionsMenu}
              selectedChat={selectedChat}
            />
            <BlockedUser
              activeChat={activeChat}
              showOptionsMenu={showOptionsMenu}
              selectedChat={selectedChat}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
