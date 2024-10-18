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
import Notifications from "./notification/notifications";

export default function Navbar() {
  const [showDropdownMenu, setShowDropdownMenu] = useState(true);
  const sessionData = useSession();
  const session: Session = sessionData.data as Session;
  const status = sessionData.status;

  const router = useRouter();

  useEffect(() => {
    setShowDropdownMenu(false);
  }, [router.asPath]);

  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:justify-between pt-4 pb-3 border-b-1 border-customBorderColor">
      <div className="self-start ml-6 mb-2 md:mb-0 md:ml-5 md:self-auto  md:order-1">
        <Link href="/">
          <div className="flex flex-row">
            <Image
              className="inline self-center"
              src="/images/icons8-chat-48.png"
              height={40}
              width={40}
              alt="Logo"
            />
            <h5 className="self-center text-xl ml-3  text-bell inline capitalize">
              Open source chat
            </h5>
          </div>
        </Link>
      </div>
      {session && session?.user && <SearchBar />}

      {status !== "loading" && (
        <div className="order-2 md:order-3 flex flex-row mr-5">
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
                    <FontAwesomeIcon
                      className="text-bell mr-2"
                      icon={faUserPlus}
                    />
                    <span className="text-lg text-bell  font-semibold cursor-pointer mr-7">
                      Sign Up
                    </span>
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
                  <Link href="/auth/login" className="self-center">
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
              <Notifications status={status} />
              {session?.user && (
                <div className="ml-10 flex flex-row">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={session.user.profilePhotoURL}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      exit={{ scale: 0 }}
                      className="mr-3 inline-block h-10 w-10 relative"
                    >
                      <Link href="/profilephoto">
                        <Image
                          layout="fill"
                          src={session.user.profilePhotoURL}
                          className="rounded-full"
                          alt="NoImage"
                        />
                      </Link>
                    </motion.div>
                  </AnimatePresence>

                  <motion.div
                    key="full-name"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    exit={{ scale: 0 }}
                    className="flex flex-col md:mr-10 relative z-20"
                  >
                    <div className="flex flex-row">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={session.user.name + session.user.lastName}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          exit={{ scale: 0 }}
                        >
                          <Link
                            href="/profile"
                            className="text-bell font-semibold capitalize"
                          >
                            {`${session.user.name} ${session.user.lastName}`}
                          </Link>
                        </motion.div>
                      </AnimatePresence>
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
                      {showDropdownMenu && (
                        <div
                          key="profile"
                          // ref={userDropDownMenuRef}
                          // initial={{ opacity: 0, scale: 0 }}
                          // animate={{ opacity: 1, scale: 1 }}
                          // transition={{ duration: 0.3 }}
                          // exit={{ scale: 0 }}
                          className="absolute z-50 flex flex-col items-center w-72 top-16 px-5 pb-3 rounded-b-2xl right-0 full-rounded bg-background border-b-1 border-l-1 border-r-1 border-customBorderColor text-sm"
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{ duration: 0.1 }}
                            exit={{ scale: 0 }}
                            className="relative capitalize w-auto  pt-3 pb-3"
                          >
                            <Link
                              href="/profile"
                              className=" text-bell text-center w-auto font-semibold capitalize  pb-3"
                              onClick={() => {
                                setShowDropdownMenu(false);
                                console.log("Clicking edit my profile.");
                              }}
                            >
                              edit my profile
                            </Link>
                          </motion.div>
                          <hr className="w-full border-1 border-customBorderColor" />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{ duration: 0.1 }}
                            exit={{ scale: 0 }}
                            className="mt-6 w-full pb-2"
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
                        </div>
                      )}
                    </div>
                    <Link href="/profile" className="text-xs text-bell">
                      {session.user.email}
                    </Link>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
