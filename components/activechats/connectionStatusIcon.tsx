import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useSocketStore } from "../../lib/store";
import { Tooltip } from 'react-tooltip'
import { useEffect, useState } from "react";



export default function ConnectionStatusIcon(props) {
  const { activeChat } = props;
  const [onlineUser, setOnlineUser] = useState({
    userId: activeChat.id,
    isOnline: false,
  });

  const usersConnectionStatus = useSocketStore(
    (state) => state.usersConnectionStatus
  );


  const timeToRefreshConnectionStatus = useSocketStore(
    (state) => state.timeToRefreshConnectionStatus
  );



  useEffect(() => {
    const interval = setInterval(() => {
      const userConnectionStatus = usersConnectionStatus.find(
        (userConnectionStatus) => userConnectionStatus.userId == activeChat.id
      );
      if (!userConnectionStatus) {
        console.log("user is offline", userConnectionStatus)
        setOnlineUser({
          userId: activeChat.id,
          isOnline: false,
        });
        return;
      }

      if (Date.now() - userConnectionStatus.time <= timeToRefreshConnectionStatus) {
        // console.log("user is online")
        setOnlineUser({
          userId: activeChat.id,
          isOnline: true,
        });
      } else {
        // console.log("user is offline")
        setOnlineUser({
          userId: activeChat.id,
          isOnline: false,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [setOnlineUser, usersConnectionStatus, activeChat.id, timeToRefreshConnectionStatus, onlineUser.isOnline]);





  return (
    <AnimatePresence mode={"wait"}
    >
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        key={activeChat.id}

      >
        {onlineUser.isOnline ? (
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
        ) : null}
      </motion.div>

    </AnimatePresence >
  );
}
