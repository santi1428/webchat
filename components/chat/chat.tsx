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
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

export default function Chat(props): JSX.Element {
  const { socket } = props;

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

  const { data: session, status } = useSession();

  const router = useRouter();

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const getMessages = async ({ pageParam = "" }) => {
    console.log("Fetching messages...");
    const res = await axios.get(
      `/api/message/${selectedChatUser.id}?cursor=${pageParam}`
    );
    return res.data;
  };

  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(["messages", selectedChatUser.id], getMessages, {
      enabled: selectedChatUser.id !== "",
      staleTime: 1000 * 60 * 5,
      getNextPageParam: (lastPage) => {
        if (lastPage.messages.length < 10) {
          return undefined;
        }
        return lastPage.messages[lastPage.messages.length - 1].id;
      },
    });

  useEffect(() => {
    setScrollMessagesToBottom(true);
  }, [router.asPath, selectedChatUser.id]);

  useEffect(() => {
    if (scrollMessagesToBottom) {
      console.log("scrollMessagesToBottom", scrollMessagesToBottom);
      console.log("data", JSON.stringify(data)?.length);
      setTimeout(() => {
        scrollBottomRef.current?.scrollIntoView();
      }, 250);
    }
  });

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

  const scrollParentRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e) => {
    // check if scroll is at bottom
    if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
      setScrollMessagesToBottom(false);
    }
  };

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
                ref={scrollParentRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-bell scrollbar-track-background2 overflow-x-hidden"
              >
                <InfiniteScroll
                  pageStart={0}
                  loadMore={!isFetchingNextPage ? fetchNextPage : () => {}}
                  hasMore={
                    data?.pages[data.pages.length - 1].messages.length >= 10
                  }
                  loader={
                    <div
                      className="flex flex-row justify-center items-center mt-8"
                      key={selectedChatUser.id}
                    >
                      <FontAwesomeIcon
                        icon={faSpinner}
                        size={"xl"}
                        spin
                        className="text-bell"
                      />
                    </div>
                  }
                  className="flex flex-col h-full"
                  useWindow={false}
                  threshold={50}
                  initialLoad={false}
                  isReverse={true}
                  getScrollParent={() => scrollParentRef.current}
                >
                  <Messages
                    messages={messagesArray}
                    user={session?.user}
                    selectedChatUser={selectedChatUser}
                  />
                  <div ref={scrollBottomRef}></div>
                </InfiniteScroll>
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
