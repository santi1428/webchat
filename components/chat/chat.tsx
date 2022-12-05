import Messages from "./messages";
import ChatHeader from "./chatHeader";
import SendMessageInput from "./sendMessageInput";
import { useChatStore, useNotificationStore } from "../../lib/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faSpinner,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery, useQuery } from "react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function Chat(props): JSX.Element {
  const { socket } = props;

  const selectedChatUser = useChatStore((state) => state.selectedChat);
  const changeSelectedChat = useChatStore((state) => state.changeSelectedChat);
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

  useEffect(() => {
    showMessageToast({
      message: "You have a new message!",
      senderProfilePhotoName: "default-profile-photo.png",
      senderName: "John",
      senderLastName: "Doe",
      createdAt: new Date(),
    });
  }, [selectedChatUser]);

  const showMessageToast = (message) => {
    console.log("message", message);
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible
              ? "transition-all ease-in duration-300 opacity-100"
              : "transition-all ease-out duration-300 opacity-0"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          onClick={() => {
            changeSelectedChat({
              id: message.senderId,
              name: message.senderName,
              lastName: message.senderLastName,
              profilePhotoName: message.senderProfilePhotoName,
              email: message.senderEmail,
            });
          }}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={
                    message.senderProfilePhotoName.includes("http")
                      ? message.senderProfilePhotoName
                      : "/images/" + message.senderProfilePhotoName
                  }
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900">{`${message.senderName} ${message.senderLastName}`}</p>
                <p className="mt-1 text-sm text-gray-500">{message.message}</p>
              </div>
              <div>
                <p className="text-xs">
                  {dayjs(message.createdAt).format("hh:mm A")}
                </p>
              </div>
              <div className="border-l border-background2 h-full">
                <FontAwesomeIcon icon={faReply} className="text-background" />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  useEffect(() => {
    if (socket?.on) {
      console.log("declaring socket events");
      socket.on("newMessage", (message) => {
        console.log("newMessage", message);
        console.table("session?.user", session?.user);
        // if (message.receiverId === session?.user.id) {
        showMessageToast(message);
        // }
        // if (message.senderId === selectedChatUser.id) {
        //   fetchNextPage();
        // }
      });
    }
  }, [socket]);

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
                className="h-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-bell scrollbar-track-background overflow-x-hidden"
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
