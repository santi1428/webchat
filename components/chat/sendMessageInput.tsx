import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { createElement } from "preact";
import axios from "axios";

export default function SendMessageInput(): JSX {
  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    const res = await axios.post("/api/message", { message });
    setMessage("");
    console.log(res);
  };

  return (
    <form
      onSubmit={sendMessage}
      className="flex flex-row w-8/12 px-16 mt-20 pt-6 border-customBorderColor absolute bottom-24"
    >
      <motion.input
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
