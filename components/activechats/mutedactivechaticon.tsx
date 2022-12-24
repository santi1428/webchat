import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { useChatStore } from "../../lib/store";

export default function MutedActiveChatIcon(props): JSX {
  const { activeChat, isUserMutedMemoized } = props;
  const selectedChat = useChatStore((state) => state.selectedChat);

  return (
    <AnimatePresence mode={"wait"}>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, scale: 0 }}
        key={isUserMutedMemoized ? 1 : 0}
        className="ml-2"
      >
        {isUserMutedMemoized ? (
          <FontAwesomeIcon
            icon={faBellSlash}
            className={` 
                ${
                  selectedChat.id === activeChat.id
                    ? "text-background2"
                    : "text-bell"
                }
                  `}
          />
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
