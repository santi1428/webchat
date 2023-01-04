import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { useChatStore } from "../../lib/store";
import { useMemo } from "react";
import useMutedUsers from "../hooks/useMutedUsers";
import { useSession } from "next-auth/react";
import useIsUserMuted from "../hooks/useIsUserMuted";

export default function MutedActiveChatIcon(props): JSX {
  const { activeChat, iconColor } = props;
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { status } = useSession();

  const { data: mutedUsers } = useMutedUsers({ status });

  const isUserMuted = useIsUserMuted({
    mutedUsers: mutedUsers.data,
    activeChatId: activeChat.id,
  });

  return (
    <AnimatePresence mode={"wait"}>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, scale: 0 }}
        key={isUserMuted ? 1 : 0}
        className="ml-2"
      >
        {isUserMuted ? (
          <FontAwesomeIcon
            size={"sm"}
            icon={faBellSlash}
            className={` 
                ${
                  iconColor !== undefined
                    ? `text-${iconColor}`
                    : selectedChat.id === activeChat.id
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
