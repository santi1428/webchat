import { useState, useEffect } from "react";
import { useSocketStore } from "../../lib/store";
import { AnimatePresence, motion } from "framer-motion";

export default function TypingStatusText(props): JSX {
  const { activeChat, style } = props;

  const [isTyping, setIsTyping] = useState(false);
  const timeToRefreshTypingStatus = useSocketStore(
    (state) => state.timeToRefreshTypingStatus
  );
  const usersTypingStatus = useSocketStore((state) => state.usersTypingStatus);
  const setUsersTypingStatus = useSocketStore(
    (state) => state.setUsersTypingStatus
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const userTypingStatus = usersTypingStatus.find(
        (userTypingStatus) => userTypingStatus.userId === activeChat.id
      );
      if (!userTypingStatus) {
        setIsTyping(false);
        return;
      }

      if (Date.now() - userTypingStatus.time <= timeToRefreshTypingStatus) {
        setIsTyping(true);
        return;
      } else {
        setIsTyping(false);
        return;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    setUsersTypingStatus,
    usersTypingStatus,
    activeChat.id,
    timeToRefreshTypingStatus,
  ]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isTyping && (
          <motion.div
            key={activeChat.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            exit={{ opacity: 0 }}
            className={style}
          >
            is typing...
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
