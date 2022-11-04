import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Message(props) {
  const { message, user, selectedChatUser, dayjs } = props;
  return (
    <>
      {message.senderId === selectedChatUser.id ? (
        <AnimatePresence mode={"wait"}>
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.1,
            }}
            exit={{ scale: 0 }}
            className="flex flex-row justify-end mt-7 mr-6"
          >
            <div className="flex flex-col">
              <div className="flex flex-row justify-end">
                <span className="self-center text-xs text-bell self-center">
                  {dayjs(message.createdAt).format("h:mm A - MMM D YYYY")}
                </span>
                <p className="self-center text-sm text-bell font-semibold mr-6 ml-3">
                  {selectedChatUser.name} {selectedChatUser.lastName}
                </p>
              </div>
              <p className="text-justify rounded-l-3xl rounded-br-3xl max-w-md text-sm bg-bell mt-2 mr-4 px-9 py-4 ml-5">
                {message.content}
              </p>
            </div>

            <div className="mr-5 inline-block h-10 w-10 relative">
              <Image
                layout="fill"
                src={
                  selectedChatUser.profilePhotoName.includes("http")
                    ? selectedChatUser.profilePhotoName
                    : "/images/" + selectedChatUser.profilePhotoName
                }
                className="rounded-full"
                alt="NoImage"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode={"wait"}>
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.1,
            }}
            exit={{ scale: 0 }}
            className="flex flex-row justify-start mt-10 ml-6"
          >
            <div className="inline-block h-12 w-10 relative">
              <Image
                layout="fill"
                src={
                  user?.profilePhotoName?.includes("http")
                    ? user?.profilePhotoName
                    : "/images/" + user?.profilePhotoName
                }
                className="rounded-full"
                alt="NoImage"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex flex-row">
                <p className="text-sm text-bell font-semibold self-end mr-5 ml-4">
                  You
                </p>
                <time className="self-center text-xs text-bell">
                  {dayjs(message.createdAt).format("h:mm A - MMM D YYYY")}
                </time>
              </div>
              <p className="w-full rounded-r-3xl rounded-bl-3xl max-w-md text-sm bg-bell mt-2 mr-4 px-9 py-4 ml-5">
                {message.content}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
