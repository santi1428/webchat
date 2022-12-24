import toast from "react-hot-toast";
import { useChatStore } from "../../lib/store";
import { AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Image from "next/image";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

export default function ChatMessageToast(props): JSX {
  const { message, t } = props;
  const changeSelectedChat = useChatStore((state) => state.changeSelectedChat);
  const router = useRouter();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0 }}
        key={message.createdAt}
        className={`mt-5 flex flex-row px-5  drop-shadow-lg 
               bg-background2  max-w-3xl rounded-2xl`}
      >
        <div>
          <div className="inline-block relative mt-5 w-10 h-10">
            <Image
              layout="fill"
              className="rounded-full"
              src={
                message.senderProfilePhotoName.includes("http")
                  ? message.senderProfilePhotoName
                  : "/images/" + message.senderProfilePhotoName
              }
              alt=""
            />
          </div>
        </div>
        <div className="flex flex-col py-5 ml-6 mr-5 ">
          <p className="text-sm text-bell font-bold  pb-1">
            {`${message.senderName} ${message.senderLastName}`}
            <span className="text-xs text-bell font-light ml-6">
              {dayjs(message.createdAt).format("hh:mm A")}
            </span>
          </p>
          <p className="mt-1 text-sm text-bell break-normal">
            {message.message}
          </p>
        </div>
        <div
          className="h-full pl-3 flex flex-col justify-center border-customBorderColor border-l-1 cursor-pointer"
          onClick={() => {
            changeSelectedChat({
              id: message.senderId,
              name: message.senderName,
              lastName: message.senderLastName,
              profilePhotoName: message.senderProfilePhotoName,
              email: message.senderEmail,
            });
            toast.dismiss(t.id);
            if (router.asPath === "/") return;
            router.push("/");
          }}
        >
          <FontAwesomeIcon icon={faReply} size={"lg"} className="text-bell" />
          <small className="mt-2 text-bell">Reply</small>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
