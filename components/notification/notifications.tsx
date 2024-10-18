import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHandMiddleFinger } from "@fortawesome/free-solid-svg-icons";
import useNotification from "../hooks/useNotification";
import useDeleteNotification from "../hooks/useDeleteNotification";
import Notification from "./notification";
import { useEffect, useState } from "react";
import { useChatStore } from "../../lib/store";

export default function Notifications(props) {
  const { status } = props;
  const notifications = useNotification({ status });
  const notificationsData = notifications?.data?.data?.notifications;
  const { deleteNotification } = useDeleteNotification();

  const [showNotifications, setShowNotifications] = useState(false);
  const selectedChat = useChatStore((state) => state.selectedChat);

  const notificationsDataFiltered = notificationsData;

  useEffect(() => {
    // console.log("selectedChat", selectedChat);
    // console.log("notificationsData", notificationsData);
    if (selectedChat.id && notificationsData?.length >= 0) {
      console.log("entering condition");
      const foundNotification = notificationsData.find(
        (notification: NotificationType) =>
          notification.sender.id === selectedChat.id
      );
      if (foundNotification) {
        console.log("foundNotification", foundNotification);
        deleteNotification({ id: foundNotification.sender.id, type: "chat" });
      }
    }
  }, [notifications?.data?.data, selectedChat.id, deleteNotification]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0, transition: { duration: 0.2 } },
    show: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showNotifications && (
          <motion.div className="relative w-0 h-0 right-2">
            <motion.div
              className="absolute z-30 w-64 max-w-64  p-5 pt-2 rounded-3xl border-text-bell right-[0px] bg-background shadow-2xl max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-bell scrollbar-track-background"
              variants={container}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="text-bell text-md font-bold pb-2 border-b border-customBorderColor text-center">
                {notificationsDataFiltered.length === 0
                  ? "You don't have any notification"
                  : "Notifications"}
              </motion.div>
              {notificationsDataFiltered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  exit={{ scale: 0 }}
                  className="text-bell text-sm font-bold pb-2 border-b border-customBorderColor text-center pt-2 cursor-pointer"
                  onClick={() => deleteNotification({ type: "all", id: "" })}
                >
                  Clear all
                </motion.div>
              )}
              {notificationsDataFiltered.map((notification) => (
                <motion.div variants={item} key={notification.id}>
                  <Notification
                    key={notification.id}
                    notification={notification}
                    deleteNotification={deleteNotification}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        exit={{ scale: 0 }}
        className="mt-2 text-bell cursor-pointer mr-1"
      >
        <a
          className="button"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
        </a>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        exit={{ scale: 0 }}
        className="relative -left-3 cursor-pointer"
        onClick={() => {
          setShowNotifications(!showNotifications);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={notificationsDataFiltered?.length}
            className={`${
              notificationsDataFiltered?.length === 0
                ? "hidden"
                : "inline-block bg-blue-300 py-[1px] px-[6px] rounded-full text-xs"
            } font-bold text-dark`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ scale: 0 }}
          >
            {notificationsDataFiltered?.length}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </>
  );
}
