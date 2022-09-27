import { AnimatePresence, motion } from "framer-motion";
import {
  faCaretUp,
  faCircleInfo,
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback, useRef } from "react";
import axios, { AxiosError } from "axios";
import debounce from "lodash.debounce";
import { User } from "../utils/types";
import Image from "next/image";
import useOnClickOutside from "./hooks/useOnClickOutside";

export default function SearchBar() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showUsersList, setShowUsersList] = useState(false);
  const usersListRef = useRef();

  useOnClickOutside(usersListRef, () => {
    setShowUsersList(false);
  });

  const getUsers = async (searchQuery: String) => {
    try {
      const users: User[] = await axios.get(`/api/users/${searchQuery}`);
      console.log("searchQuery state", searchQuery);
      console.log(users.data);
      setUsers(users.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsersDebounced = useCallback(debounce(getUsers, 400), []);

  useEffect(() => {
    if (search.trim() !== "") {
      getUsersDebounced(search);
      setShowUsersList(true);
    }else{
      setUsers([]);
    }
  }, [search]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 2,
      },
    },
  };

  return (
    <form className="relative mr-10 lg:ml-10 w-64 lg:w-96 relative max-h-80">
      <motion.input
        whileFocus={{ scale: 1.03 }}
        onFocus={() => {
          setShowUsersList(true);
        }}
        onClick={() => {
          setShowUsersList(true);
        }}
        type="text"
        name="name"
        className="rounded-2xl w-full pl-4 pt-2 pb-2 pr-2 bg-background2 border border-customBorderColor focus:outline-none text-bell"
        placeholder="Enter the name or email"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        value={search}
      />
      <AnimatePresence mode="wait">
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          exit={{ scale: 0 }}
          type="button"
          className="absolute top-3 right-4"
          onClick={() => {
            setShowUsersList(true);
          }}
        >
          <FontAwesomeIcon
            className={"text-bell text-lg"}
            icon={faMagnifyingGlass}
          />
        </motion.button>
      </AnimatePresence>
      {showUsersList && (
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key="fa-caret-up"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              exit={{ scale: 0 }}
              className="absolute left-1/2 text-background2 text-center -mb-3 -mt-1 z-50"
            >
              <FontAwesomeIcon icon={faCaretUp} size={"2xl"} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={users.length}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              exit={{ scale: 0 }}
              className="absolute top-14 bg-background2 rounded-b-2xl rounded-t-xl w-full z-40"
            >
              <ul className="px-4 pb-4" ref={usersListRef}>
                {users.length === 0 && search !== "" && (
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
                {users.map((user: User, index: Number) => (
                  <AnimatePresence mode="wait" key={user.id}>
                    <motion.li
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
                            user.profilePhotoName.includes("http")
                              ? user.profilePhotoName
                              : "/images/" + user.profilePhotoName
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
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </form>
  );
}
