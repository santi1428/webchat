import { AnimatePresence, motion } from "framer-motion";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback, useRef } from "react";
import axios, { AxiosError } from "axios";
import { User } from "../../utils/types";
import UsersList from "./usersList";
import { useQuery } from "react-query";
import useDebounce from "../hooks/useDebounce";
import { useNotificationStore } from "../../lib/store";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  const [showUsersList, setShowUsersList] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusedSearchInput = useNotificationStore(
    (state) => state.focusedSearchInput
  );
  const setFocusedSearchInput = useNotificationStore(
    (state) => state.setFocusedSearchInput
  );

  useEffect(() => {
    if (focusedSearchInput) {
      inputRef.current?.focus();
    }
    setFocusedSearchInput(false);
  }, [focusedSearchInput]);

  const getUsers = async (debouncedSearch) => {
    // console.log("debouncedSearch", debouncedSearch);
    if (!debouncedSearch) {
      return [];
    }
    const res = await axios.get(`/api/users/${debouncedSearch}`);
    const users: User[] = res.data;
    // console.log("Requesting data...");
    return users;
  };

  const { isSuccess, data } = useQuery(
    [debouncedSearch],
    () => getUsers(debouncedSearch),
    {
      enabled: search.length > 0,
      staleTime: 1000 * 60 * 5,
    }
  );

  // console.log("status", status);

  return (
    <form className="order-3 md:order-2 relative ml-2 md:mr-10 md:ml-10 w-3/4 md:w-96  max-h-80 z-20">
      <motion.input
        whileTap={{ scale: 0.95 }}
        whileFocus={{ scale: 1.03 }}
        ref={inputRef}
        onFocus={() => {
          setShowUsersList(true);
        }}
        onClick={() => {
          setShowUsersList(true);
        }}
        name="name"
        className="rounded-2xl w-full pl-4 pt-2 pb-2 pr-2 bg-background2 border border-customBorderColor focus:outline-none text-bell"
        placeholder="Enter the name or email"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        value={search}
        autoComplete="new-password"
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
        <UsersList
          data={data}
          search={search}
          setSearch={setSearch}
          setShowUsersList={setShowUsersList}
        />
      )}
    </form>
  );
}
