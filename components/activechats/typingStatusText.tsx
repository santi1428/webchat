import { useState, useEffect } from "react";
import { useSocketStore } from "../../lib/store";
import { AnimatePresence, motion } from "framer-motion";

export default function TypingStatusText(props): JSX.Element {
  const { activeChat, style } = props;

  const [isTyping, setIsTyping] = useState(false);

  const activeUsersTyping = useSocketStore((state) => state.activeUsersTyping);

  useEffect(() => {
    const userTyping = activeUsersTyping.find(
      (user) => user.userId === activeChat.id
    );
    if (userTyping) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [activeUsersTyping]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isTyping && (
          <motion.div
            key={activeChat.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
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
