import { motion } from "framer-motion";
import { useNotificationStore } from "../../lib/store";
import Message from "./message";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useEffect, useMemo } from "react";

export default function Messages(props): JSX {
  const { messages, user, selectedChatUser } = props;

  const setFocusedMessageInput = useNotificationStore(
    (state) => state.setFocusedMessageInput
  );

  useEffect(() => {
    dayjs.locale("es");
  });

  return (
    <>
      {messages?.length === 0 || messages === null ? (
        <motion.div
          className="h-96 md:h-[calc(100vh-300px)] flex flex-col justify-center items-center"
          key={messages?.length}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          exit={{ scale: 0 }}
        >
          <div className="cursor-pointer text-bell text-md md:text-lg self-center">
            <span
              className="underline"
              onClick={() => {
                setFocusedMessageInput(true);
              }}
            >
              Write something to {selectedChatUser.name}...
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.div>
          {messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              user={user}
              selectedChatUser={selectedChatUser}
              dayjs={dayjs}
            />
          ))}
        </motion.div>
      )}
    </>
  );
}
