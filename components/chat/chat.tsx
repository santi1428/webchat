import Messages from "./messages";
import ChatHeader from "./chatHeader";
import SendMessageInput from "./sendMessageInput";
import { useChatStore, useNotificationStore } from "../../lib/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery, useQuery } from "react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useField } from "formik";
import { useRouter } from "next/router";

export default function Chat(): JSX.Element {
  const selectedChatUser = useChatStore((state) => state.selectedChat);
  const setFocusedSearchInput = useNotificationStore(
    (state) => state.setFocusedSearchInput
  );
  const resetSelectedChat = useChatStore((state) => state.reset);
  const scrollMessagesToBottom = useNotificationStore(
    (state) => state.scrollMessagesToBottom
  );
  const setScrollMessagesToBottom = useNotificationStore(
    (state) => state.setScrollMessagesToBottom
  );

  const session = useSession();

  const router = useRouter();

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const getMessages = async ({ pageParam = "" }) => {
    const res = await axios.get(
      `/api/message/${selectedChatUser.id}?cursor=${pageParam}`
    );
    return res.data;
  };

  useEffect(() => {
    console.log("router as path", router.asPath);
    setScrollMessagesToBottom(true);
  }, [router.asPath, selectedChatUser.id]);

  useEffect(() => {
    if (scrollMessagesToBottom) {
      setTimeout(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        setScrollMessagesToBottom(false);
      }, 300);
    }
  }, [scrollMessagesToBottom]);

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["messages", selectedChatUser.id],
    getMessages,
    {
      enabled: selectedChatUser.id !== "",
      staleTime: 1000 * 60 * 5,
      getNextPageParam: (lastPage) => {
        console.log("lastpage.messages", lastPage.messages);
        if (lastPage.messages.length < 10) {
          return undefined;
        }
        return lastPage.messages[lastPage.messages.length - 1].id;
      },
      onSuccess: () => {
        if (scrollMessagesToBottom) {
          setTimeout(() => {
            scrollBottomRef.current?.scrollIntoView({
              behavior: "smooth",
            });
            setScrollMessagesToBottom(false);
          }, 100);
        }
      },
    }
  );

  console.log("data", data);

  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop === 0) {
      fetchNextPage();
    }
  };

  const getMessagesArray = () => {
    const messagesArray = [];
    data?.pages.forEach((page) => {
      page.messages.forEach((message) => {
        messagesArray.push(message);
      });
    });
    messagesArray.reverse();
    return messagesArray;
  };

  const messagesArray = useMemo(getMessagesArray, [data]);

  return (
    <>
      <AnimatePresence mode={"wait"}>
        {selectedChatUser.id === "" ? (
          <motion.div
            className="col-span-8 flex flex-col justify-center items-center h-full"
            key={selectedChatUser.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ scale: 0 }}
          >
            <div
              className="flex flex-row  cursor-pointer text-bell text-xl self-center"
              onClick={() => setFocusedSearchInput(true)}
            >
              <span className="mr-4">
                <FontAwesomeIcon icon={faMessage} size={"xl"} />
              </span>
              <span className="underline">Start a new conversation.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={selectedChatUser.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
            className="col-span-8 flex flex-col"
          >
            <ChatHeader
              selectedChatUser={selectedChatUser}
              resetSelectedChat={resetSelectedChat}
            />
            {/*Chat*/}
            <div className="flex flex-col h-[calc(100vh-145px)]">
              <div
                onScroll={handleScroll}
                className="h-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-bell scrollbar-track-background2 overflow-x-hidden"
              >
                <AnimatePresence mode={"wait"}>
                  <motion.div
                    key={isFetchingNextPage ? 1 : 0}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    {isFetchingNextPage && (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="fa-spin self-center text-bell mt-5"
                        size="xl"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                <Messages
                  messages={messagesArray}
                  user={session?.data?.user}
                  selectedChatUser={selectedChatUser}
                />
                <div ref={scrollBottomRef}></div>
              </div>
              <div>
                <SendMessageInput selectedChatUser={selectedChatUser} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
