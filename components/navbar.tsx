import {
  faUserPlus,
  faRightToBracket,
  faRightFromBracket,
  faBell,
  faSquareCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SearchBar from "./searchbar/searchBar";
import { useRef } from "react";
import useOnClickOutside from "./hooks/useOnClickOutside";

export default function Navbar() {
  const [showDropdownMenu, setShowDropdownMenu] = useState(true);
  const { data: session, status } = useSession();
  const userDropDownMenuRef = useRef();

  const router = useRouter();

  useEffect(() => {
    setShowDropdownMenu(false);
  }, [router.asPath]);

  useOnClickOutside(userDropDownMenuRef, () => {
    setShowDropdownMenu(false);
  });

  return (
    <div className="flex flex-row justify-between pt-4 pb-3 border-b-1 border-customBorderColor ">
      <div className="ml-5">
        <Link href="/">
          <a>
            <div className="flex flex-row">
              <Image
                className="inline self-center"
                src="/images/icons8-chat-48.png"
                height={40}
                width={40}
                alt="Logo"
              />
              <h5 className="self-center text-xl ml-3 text-bell inline capitalize">
                Open source chat
              </h5>
            </div>
          </a>
        </Link>
      </div>
      {session && session?.user && <SearchBar />}

      {status !== "loading" && (
        <div className="flex flex-row mr-5">
          {status === "unauthenticated" ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  className="my-0 py-0 self-center"
                  key="sign-up"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ scale: 0 }}
                >
                  <Link href="/auth/register" className="self-center">
                    <a className="self-center">
                      <FontAwesomeIcon
                        className="text-bell mr-2"
                        icon={faUserPlus}
                      />
                      <span className="text-lg text-bell  font-semibold cursor-pointer mr-7">
                        Sign Up
                      </span>
                    </a>
                  </Link>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  className="my-0 py-0 h-auto w-auto self-center"
                  key="sign-in"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ scale: 0 }}
                >
                  <Link href="/auth/login">
                    <a className="self-center">
                      <FontAwesomeIcon
                        className="text-bell mr-2"
                        icon={faRightToBracket}
                      />
                      <span className="text-lg text-bell font-semibold cursor-pointer mr-7">
                        Sign In
                      </span>
                    </a>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ scale: 0 }}
                  className="mt-2 text-bell mr-1"
                >
                  <a className="button">
                    <FontAwesomeIcon icon={faBell} size="lg" />
                  </a>
                </motion.div>
              </AnimatePresence>
              {session.user && (
                <div className="flex flex-row">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={session.user.profilePhotoName}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      exit={{ scale: 0 }}
                      className="ml-5 mr-3 inline-block h-10 w-10 relative"
                    >
                      <Link href="/profilephoto">
                        <a>
                          <Image
                            layout="fill"
                            src={"/images/" + session.user.profilePhotoName}
                            className="rounded-full"
                            alt="NoImage"
                          />
                        </a>
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="full-name"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      exit={{ scale: 0 }}
                      className="flex flex-col mr-10 relative"
                    >
                      <div className="flex flex-row">
                        <Link href="/profile">
                          <a className="text-bell font-semibold capitalize">
                            {`${session.user.name} ${session.user.lastName}`}
                          </a>
                        </Link>
                        <div className="mt-1 h-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setShowDropdownMenu(!showDropdownMenu);
                            }}
                          >
                            <FontAwesomeIcon
                              className="mr-2 text-xl ml-5 text-bell"
                              icon={faSquareCaretDown}
                            />
                          </button>
                        </div>
                        {/*Dropdown Menu*/}
                        <AnimatePresence mode="wait">
                          {showDropdownMenu && (
                            <motion.div
                              key="profile"
                              ref={userDropDownMenuRef}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              exit={{ scale: 0 }}
                              className="flex flex-col absolute top-8 right-2 px-5 pb-3 rounded-b-2xl right-0 full-rounded bg-background border-b-1 border-l-1 border-r-1 border-customBorderColor text-sm"
                            >
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                transition={{ duration: 0.3 }}
                                exit={{ scale: 0 }}
                                className="capitalize w-full pt-3"
                              >
                                <Link href="/profile">
                                  <a
                                    className="text-bell text-center font-semibold capitalize border-b-1 border-customBorderColor pb-3"
                                    onClick={() => {
                                      setShowDropdownMenu(false);
                                    }}
                                  >
                                    My Profile
                                  </a>
                                </Link>
                              </motion.div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                transition={{ duration: 0.3 }}
                                exit={{ scale: 0 }}
                                className="mt-6 w-full"
                                onClick={async () => {
                                  setShowDropdownMenu(false);
                                  await signOut({ redirect: false });
                                  router.push("/auth/login");
                                }}
                              >
                                <FontAwesomeIcon
                                  className="text-bell mr-2"
                                  icon={faRightFromBracket}
                                />
                                <span className="text-bell  font-semibold cursor-pointer">
                                  Sign Out
                                </span>
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <Link href="/profile">
                        <a className="text-xs text-bell">
                          {session.user.email}
                        </a>
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
