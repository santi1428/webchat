import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { useChatStore } from "../../lib/store";
import { useRouter } from "next/router";

export default function ListUser(props) {
  const { user, setShowUsersList, setSearch } = props;

  const changeSelectedChat = useChatStore((state) => state.changeSelectedChat);

  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.li
        key={user.id}
        onClick={() => {
          router.push("/");
          setShowUsersList(false);
          changeSelectedChat(user);
          setSearch("");
        }}
        whileHover={{ scale: 1.08 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ scale: 0 }}
        className="flex flex-row mt-2 pl-4 py-2 text-bell border-b-1 border-customBorderColor
                      hover:border-b-1 hover:border-bell hover:bg-bell hover:text-background2 cursor-pointer"
      >
        <div className="h-10 w-10 relative">
          <Image
            layout="fill"
            src={
              user.profilePhotoName
            }
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="flex flex-col">
          <p className="ml-4 font-semibold capitalize">
            {`${user.name} ${user.lastName}`}
          </p>
          <small className="ml-4">{user.email}</small>
        </div>
      </motion.li>
    </AnimatePresence>
  );
}
