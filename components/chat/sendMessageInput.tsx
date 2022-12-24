import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useChatStore, useNotificationStore } from "../../lib/store";
import { useSession } from "next-auth/react";

export default function SendMessageInput(props): JSX {
  const { selectedChatUser, socket } = props;
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();

  const inputRef = useRef<HTMLInputElement>(null);

  const focusedMessageInput = useNotificationStore(
    (state) => state.focusedMessageInput
  );
  const setFocusedMessageInput = useNotificationStore(
    (state) => state.setFocusedMessageInput
  );

  const setScrollMessagesToBottom = useNotificationStore(
    (state) => state.setScrollMessagesToBottom
  );

  const queryClient = useQueryClient();

  const getRoomID = useChatStore((state) => state.getRoomID);

  useEffect(() => {
    if (focusedMessageInput) {
      inputRef.current?.focus();
      inputRef.current?.click();
    }
    setFocusedMessageInput(false);
  }, [focusedMessageInput]);

  const sendSocketMessage = () => {
    socket.emit("sendMessage", {
      roomID: getRoomID(session.user.id, selectedChatUser.id),
      senderId: session.user.id,
      message,
      senderProfilePhotoName: session.user.profilePhotoName,
      senderName: session.user.name,
      senderLastName: session.user.lastName,
      senderEmail: session.user.email,
      createdAt: new Date().toISOString(),
    });
  };

  const { mutate } = useMutation(
    () =>
      axios.post("/api/message/addmessage", {
        message,
        receiverId: selectedChatUser.id,
      }),
    {
      onSuccess: async () => {
        console.log("mutation success");
        console.log(["messages", selectedChatUser.id]);
        await queryClient.invalidateQueries(["messages", selectedChatUser.id]);
        sendSocketMessage();
        setScrollMessagesToBottom(true);
      },
    }
  );

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      return;
    }
    mutate();

    setMessage("");
  };

  return (
    <form
      onSubmit={sendMessage}
      className="flex flex-row w-12/12 px-16 border-customBorderColor pb-10 pt-5"
    >
      <motion.input
        ref={inputRef}
        whileTap={{ scale: 1.01 }}
        type="text"
        name="name"
        className="rounded-2xl w-full pl-4 py-3 pr-2 bg-background2 border border-customBorderColor focus:outline-none text-bell"
        placeholder="Write something"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="self-center ml-4 rounded-full h-12 w-14 flex justify-center items-center bg-bell"
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="text-background"
          size={"lg"}
        />
      </motion.button>
    </form>
  );
}
