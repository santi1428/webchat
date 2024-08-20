import { AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faCaretUp, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import ListUser from "./listUser";
import { useSession } from "next-auth/react";

export default function UsersList(props) {
  const { data, setShowUsersList, setSearch, search } = props;

  const usersListRef = useRef();

  const sessionData = useSession();
  const session: Session = sessionData.data as Session;
  const status = sessionData.status;

  useOnClickOutside(usersListRef, () => {
    setShowUsersList(false);
  });

  return (
    <>
        <AnimatePresence mode="wait">
          <motion.div
            key="fa-caret-up"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ scale: 0 }}
            className="absolute left-1/2 text-background2 text-center -mb-3 -mt-1"
          >
            <FontAwesomeIcon icon={faCaretUp} size={"2xl"} />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={data?.length}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ scale: 0 }}
            className="absolute top-14 bg-background2 rounded-b-2xl rounded-t-xl w-full"
          >
            <ul className="px-4 pb-4" ref={usersListRef}>
              {data?.length === 0 && search.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.li
                    key="no-users-found"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ scale: 0 }}
                    className="flex flex-row mt-2 pl-4 py-2 border-b-1 border-customBorderColor text-bell"
                  >
                    <span>
                      <FontAwesomeIcon icon={faCircleInfo} />
                    </span>
                    <span className="ml-3">No results found.</span>
                  </motion.li>
                </AnimatePresence>
              )}
              {data
                ?.filter((user : User) => user.id !== session?.user?.id)
                .map((user: User, index: Number) => (
                  <ListUser
                    user={user}
                    key={user.id}
                    setShowUsersList={setShowUsersList}
                    setSearch={setSearch}
                  />
                ))}
            </ul>
          </motion.div>
        </AnimatePresence>
    </>
  );
}
