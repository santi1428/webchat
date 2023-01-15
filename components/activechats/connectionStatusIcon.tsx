import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useSocketStore } from "../../lib/store";
import { useMemo } from "react";

export default function ConnectionStatusIcon(props) {
  const { activeChat } = props;

  const usersConnectionStatus = useSocketStore(
    (state) => state.usersConnectionStatus
  );

  // const userConnectionStatus = useMemo(() => {
  //   return usersConnectionStatus.find(
  //     (userConnectionStatus) => userConnectionStatus.userId === activeChat.id
  //   );
  // }, [usersConnectionStatus, activeChat]);

  const userConnectionStatus = () => {
    console.log(
      "usersConnectionStatus from connectionStatusIcon.tsx",
      usersConnectionStatus.find(
        (userConnectionStatus) => userConnectionStatus.userId === activeChat.id
      )
    );
    return usersConnectionStatus.find(
      (userConnectionStatus) => userConnectionStatus.userId === activeChat.id
    );
  };

  return (
    <AnimatePresence mode={"wait"}>
      <motion.div
        key={userConnectionStatus?.userId}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0 }}
      >
        {userConnectionStatus()?.status === "online" ? (
          <FontAwesomeIcon
            icon={faCircle}
            size={"sm"}
            className="ml-2 text-green"
            fade={true}
          />
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
