import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { useChatStore } from "../../lib/store";

const useChatMessages = () => {
  const selectedChatUser = useChatStore((state) => state.selectedChat);

  const getMessages = async ({ pageParam = "" }) => {
    console.log("Fetching messages...");
    const res = await axios.get(
      `/api/message/${selectedChatUser.id}?cursor=${pageParam}`
    );
    return res.data;
  };

  return useInfiniteQuery(["messages", selectedChatUser.id], getMessages, {
    enabled: selectedChatUser.id !== "",
    getNextPageParam: (lastPage) => {
      if (lastPage.messages.length < 10) {
        return undefined;
      }
      return lastPage.messages[lastPage.messages.length - 1].id;
    },
  });
};

export default useChatMessages;
