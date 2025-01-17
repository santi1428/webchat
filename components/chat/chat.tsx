import Messages from "./messages";
import ChatHeader from "./chatHeader";
import SendMessageInput from "./sendMessageInput";
import {
  useChatStore,
  useNotificationStore,
  useSocketStore,
} from "../../lib/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";
import useChatMessages from "../hooks/useChatMessages";
import ResponseSuggestions from "../responseSuggestion/responseSuggestions";
import { useQueryClient } from "react-query";

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
  const socket = useSocketStore((state) => state.socket);
  const joinedRooms = useSocketStore((state) => state.joinedRooms);
  const setJoinedRooms = useSocketStore((state) => state.setJoinedRooms);
  const hasJoinedRooms = useSocketStore((state) => state.hasJoinedRooms);
  const getRoomID = useChatStore((state) => state.getRoomID);

  const sessionData = useSession();
  const session: Session = sessionData.data as Session;
  const status = sessionData?.status;

  const router = useRouter();

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, isFetchingNextPage } = useChatMessages();

  useEffect(() => {
    if (selectedChatUser.id !== "" && session?.user?.id && socket) {
      const roomID = getRoomID(session.user.id, selectedChatUser.id);
      if (!joinedRooms.includes(roomID)) {
        socket.emit("joinRooms", [roomID]);
        setJoinedRooms([...joinedRooms, roomID]);
      }
    }
  }, [selectedChatUser, joinedRooms, session, socket, setJoinedRooms]);

  useEffect(() => {
    setScrollMessagesToBottom(true);
  }, [router.asPath, selectedChatUser.id]);

  useEffect(() => {
    if (scrollMessagesToBottom) {
      setTimeout(() => {
        scrollBottomRef.current?.scrollIntoView({
          block: "end",
          inline: "nearest",
        });
      }, 200);
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
    setScrollMessagesToBottom(false);

    // // check if scroll is at bottom
    // if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
    //   window.scrollBy(0, 10);
    // }
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.removeQueries(["responseSuggestions"]);
  }, [selectedChatUser?.id]);

  return (
    <>
      <AnimatePresence mode={"wait"}>
        {selectedChatUser.id === "" ? (
          <motion.div
            className="col-span-8 flex flex-col justify-center items-center h-[calc(100vh-100vh*0.3)]"
            key={selectedChatUser.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
              <span className="underline text-sm md:text-lg">
                Start a new conversation.
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={selectedChatUser.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0 }}
            className="col-span-8 flex flex-col justify-start relative"
          >
            <ChatHeader
              selectedChatUser={selectedChatUser}
              resetSelectedChat={resetSelectedChat}
            />
            {/*Chat*/}
            {/* <div className="flex flex-col h-[calc(100vh-100vh*0.5)] md:h-[calc(100vh-145px)]"> */}
            <div className="flex flex-col h-96 md:h-[calc(100vh-145px)]">
              <div
                ref={scrollParentRef}
                onScroll={handleScroll}
                className="h-full scrollbar-thin scrollbar-thumb-bell scrollbar-track-background overflow-x-hidden"
              >
                <InfiniteScroll
                  pageStart={0}
                  loadMore={(page: number) => {
                    if (!isFetchingNextPage) {
                      fetchNextPage(); // Call fetchNextPage without parameters
                    }
                  }}
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
                  className="flex flex-col z-0"
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
                  <ResponseSuggestions session={session} status={status} />

                  <div ref={scrollBottomRef}></div>
                </InfiniteScroll>
              </div>
              <div className="">
                <SendMessageInput
                  selectedChatUser={selectedChatUser}
                  socket={socket}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
