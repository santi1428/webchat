import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useChatStore, useNotificationStore } from "../../lib/store";
import { useSession } from "next-auth/react";
import useDebounce from "../hooks/useDebounce";

export default function SendMessageInput(props): JSX {
  const { selectedChatUser, socket } = props;
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();
  const debouncedTypingEvent = useDebounce(message, 50);

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
      inputRef.current?.focus({ preventScroll: true });
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

  const checkIfChatIsAlreadyInActiveChats = () => {
    const activeChats = queryClient.getQueryData("activeChats");
    const chat = activeChats?.data.find(
      (chat) => chat.id === selectedChatUser.id
    );
    return chat !== undefined;
  };

  const { mutate } = useMutation(
    () =>
      axios.post("/api/message/addmessage", {
        message,
        receiverId: selectedChatUser.id,
      }),
    {
      onSuccess: async () => {
        if (!checkIfChatIsAlreadyInActiveChats()) {
          socket.emit("joinRooms", [
            getRoomID(session.user.id, selectedChatUser.id),
          ]);
        }
        await queryClient.invalidateQueries("activeChats");
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
    setFocusedMessageInput(true);
  };

  const emitTypingEvent = () => {
    socket.emit("typing", {
      roomID: getRoomID(session.user.id, selectedChatUser.id),
      senderId: session.user.id,
      senderName: session.user.name,
    });
  };

  const textInputOnChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (debouncedTypingEvent) {
      emitTypingEvent();
    }
  }, [debouncedTypingEvent]);

  return (
    <form
      onSubmit={sendMessage}
      className="flex flex-row w-12/12 px-6 md:px-16 border-customBorderColor md:pb-10 md:pt-5 md:relative"
    >
      <motion.input
        ref={inputRef}
        onFocus={(e) => {
          e.target.focus({ preventScroll: true });
        }}
        
        whileTap={{ scale: 1.01 }}
        type="text"
        name="name"
        className="rounded-2xl w-full md:pl-4 md:py-3 md:pr-2 py-1 pl-2 pr-1 bg-background2 border border-customBorderColor focus:outline-none text-bell md:text-base text-sm"
        placeholder="Write something"
        onChange={textInputOnChange}
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
