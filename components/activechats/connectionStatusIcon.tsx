import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useSocketStore } from "../../lib/store";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";

export default function ConnectionStatusIcon(props) {
  const { activeChat } = props;
  const activeUsers = useSocketStore((state) => state.activeUsers);
  const [onlineUser, setOnlineUser] = useState({
    userId: activeChat.id,
    isOnline: false,
  });

  useEffect(() => {
    const user = activeUsers.find((user) => user.userId === activeChat.id);
    if (user) {
      setOnlineUser({
        userId: user.userId,
        isOnline: true,
      });
    } else {
      setOnlineUser({
        userId: activeChat.id,
        isOnline: false,
      });
    }
  }, [activeUsers]);

  return (
    <AnimatePresence mode={"wait"}>
      {onlineUser.isOnline ? (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          key={activeChat.id}
        >
          <div>
            <a
              data-tooltip-id="status-connection-tooltip"
              data-tooltip-content="Online"
              data-tooltip-place="top"
            >
              <FontAwesomeIcon
                icon={faCircle}
                size={"sm"}
                className="ml-1 md:ml-2 text-green"
              />
            </a>
            <Tooltip id="status-connection-tooltip" />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
