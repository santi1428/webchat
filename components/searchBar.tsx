import { AnimatePresence, motion } from "framer-motion";
import {
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import debounce from "lodash.debounce";
import { User } from "../utils/types";

export default function SearchBar() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

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
    }
  }, [search]);

  return (
    <form className="relative mr-10 lg:ml-10 w-64 lg:w-96">
      <motion.input
        whileFocus={{ scale: 1.03 }}
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
        >
          <FontAwesomeIcon
            className={"text-bell text-lg"}
            icon={faMagnifyingGlass}
          />
        </motion.button>
      </AnimatePresence>
    </form>
  );
}
