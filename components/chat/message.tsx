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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 90,
              delay: 0.1,
            }}
            className="flex flex-row justify-end mt-7 mr-6"
          >
            <div className="flex flex-col relative">
              <div className="flex flex-row justify-end">
                <span className="self-center text-xs text-bell">
                  {dayjs(message.createdAt).format("MMM D YYYY")}
                </span>
                <p className="self-center text-sm text-bell font-semibold mr-6 ml-3">
                  {selectedChatUser.name} {selectedChatUser.lastName}
                </p>
              </div>
              <div className="flex flex-col rounded-l-3xl rounded-br-3xl bg-bell px-5 md:px-9 md:pt-6 pt-3 pb-4  mt-2 mr-4  ml-5 min-w-max">
                <p className="text-justify break-words  max-w-xs  text-xs md:text-sm text">
                  {message.content}
                </p>
                <p className="text-xs font-semibold text-background self-end md:text-sm pt-1">
                  {dayjs(message.createdAt).format("hh:mm A")}
                </p>
              </div>
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
              stiffness: 90,
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
                  {dayjs(message.createdAt).format("MMM D YYYY")}
                </time>
              </div>
              <div className="flex flex-col rounded-bl-3xl rounded-tr-3xl rounded-br-3xl bg-bell px-5  md:px-9 md:pt-6 pt-3 pb-4  mt-2 mr-4  ml-5">
                <p className="text-justify break-words min-w-xs max-w-lg text-xs  md:text-sm">
                  {message.content}
                </p>
                <p className="text-xs md:text-sm font-semibold text-background self-end pt-1">
                  {dayjs(message.createdAt).format("hh:mm A")}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
