import { motion } from "framer-motion";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import useMutedUsers from "../../hooks/useMutedUsers";
import useIsUserMuted from "../../hooks/useIsUserMuted";

export default function MutedUser(props) {
  const { showOptionsMenu, selectedChat, activeChat } = props;

  const queryClient = useQueryClient();

  const { data: mutedUsers } = useMutedUsers({ status });

  const isUserMuted = useIsUserMuted({
    mutedUsers: mutedUsers?.data,
    activeChatId: activeChat.id,
  });

  const { mutate: muteUser } = useMutation(
    () =>
      axios.post("/api/muteduser", {
        mutedUserId: activeChat.id,
      }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("mutedUsers");
        showMutingNotification(true, activeChat.name);
      },
      onError: async () => {},
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
        showMutingNotification(false, activeChat.name);
      },
    }
  );

  const showMutingNotification = (isUserMuted, name) => {
    toast(
      !isUserMuted
        ? `You will now receive notifications from ${name}.`
        : `You will no longer receive notifications from ${name}.`,
      {
        icon: !isUserMuted ? "🔔" : "🔕",
        duration: 3000,
        position: "bottom-center",
        style: {
          borderRadius: "1rem",
          marginBottom: "40px",
          fontSize: "1rem",
          maxWidth: "28rem",
        },
      }
    );
  };

  return (
    <div
      className="flex flex-row items-center"
      onClick={(e) => {
        if (isUserMuted) {
          unMuteUser();
        } else {
          muteUser();
        }
        e.stopPropagation();
      }}
    >
      <FontAwesomeIcon
        icon={isUserMuted ? faBell : faBellSlash}
        className={`py-3 md:py-3 pl-2 md:self-center md:pl-5
          ${
            selectedChat.id === activeChat.id ? "text-bell" : "text-background2"
          }
            `}
      />
      <p className="capitalize md:py-3 px-1 md:px-2 w-auto md:text-sm text-xs z-10">
        {isUserMuted ? "Unmute notifications" : "Mute notifications"}
      </p>
    </div>
  );
}
