import {
  faBell,
  faBellSlash,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChatStore } from "../../lib/store";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useOnClickOutside from "../hooks/useOnClickOutside";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export default function OptionsMenu(props): JSX {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const { activeChat, isUserMutedMemoized } = props;

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuButtonRef = useRef(null);

  const queryClient = useQueryClient();

  useOnClickOutside(optionsMenuButtonRef, () => {
    setShowOptionsMenu(false);
  });

  const { mutate: muteUser } = useMutation(
    () =>
      axios.post("/api/muteduser", {
        mutedUserId: activeChat.id,
      }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("mutedUsers");
        toast("Chat is muted", {
          icon: "🔕",
          position: "bottom-center",
        });
      },
      onError: async () => {
        queryClient.invalidateQueries("mutedUsers");
      },
    }
  );

  const { mutate: unMuteUser } = useMutation(
    () =>
      axios.delete("/api/muteduser", {
        data: {
          mutedUserId: activeChat.id,
        },
      }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("mutedUsers");
      },
    }
  );

  return (
    <div
      className="relative z-50"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        ref={optionsMenuButtonRef}
        className="cursor-pointer pl-2"
        onClick={(e) => {
          e.stopPropagation();
          setShowOptionsMenu(!showOptionsMenu);
        }}
      >
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          size="xl"
          className={`pr-6 ${
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
            onClick={(e) => {
              if (isUserMutedMemoized) {
                unMuteUser();
              } else {
                muteUser();
              }
              e.stopPropagation();
            }}
            className={`absolute right-8 top-6 flex flex-row rounded-l-md rounded-br-md drop-shadow-2xl ${
              selectedChat.id === activeChat.id
                ? "bg-background2 text-bell"
                : "bg-bell text-background2"
            } w-48`}
          >
            <FontAwesomeIcon
              icon={isUserMutedMemoized ? faBell : faBellSlash}
              className={`py-4 pl-3
                ${
                  selectedChat.id === activeChat.id
                    ? "text-bell"
                    : "text-background2"
                }
                  `}
            />
            <p className="capitalize py-3 px-2 w-auto">
              {isUserMutedMemoized
                ? "Unmute notifications"
                : "Mute notifications"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
