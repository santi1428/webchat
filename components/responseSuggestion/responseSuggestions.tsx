import useChatMessages from "../hooks/useChatMessages";
import { useEffect, useMemo } from "react";
import useResponseSuggestions from "../hooks/useResponseSuggestions";
import { motion } from "framer-motion";
import ResponseSuggestion from "./responseSuggestion";
import { useNotificationStore } from "../../lib/store";
import { useQueryClient } from "react-query";

export default function ResponseSuggestions(props): JSX.Element {
  const { session, status } = props;
  const chatMessages = useChatMessages()?.data?.pages[0].messages;
  const setScrollMessagesToBottom = useNotificationStore(
    (state) => state.setScrollMessagesToBottom
  );
  const queryClient = useQueryClient();

  const isLastMessageFromLoggedUser = useMemo(() => {
    if (chatMessages && chatMessages.length > 0) {
      const lastMessage = chatMessages[0];

      if (lastMessage.senderId === session?.user?.id) {
        return true;
      }

      return false;
    }

    return false;
  }, [chatMessages, session?.user?.id]);

  const stringForResponseSuggestions = useMemo(() => {
    if (chatMessages && !isLastMessageFromLoggedUser) {
      const messages = chatMessages.slice(0, 5);
      const result = messages.reverse().map((message) => {
        if (message.senderId === session?.user?.id) {
          return `User A: ${message.content}`;
        } else {
          return `User B: ${message.content}`;
        }
      });

      return result.join("||");
    } else {
      return "";
    }
  }, [chatMessages, isLastMessageFromLoggedUser]);

  const { data: responseSuggestions, isFetching } = useResponseSuggestions({
    status,
    data: stringForResponseSuggestions,
  });

  //   const responseSuggestions = [];

  const parsedResponseSuggestions = useMemo(() => {
    if (responseSuggestions?.data?.response) {
      return JSON.parse(responseSuggestions?.data?.response);
    }

    return [];

    // return ["¿Y tú?", "Nada mucho", "Hablando contigo"];
  }, [responseSuggestions]);

  useEffect(() => {
    if (!isFetching) {
      setScrollMessagesToBottom(true);
    }
    // setTimeout(() => setScrollMessagesToBottom(true), 200);
  }, [isFetching]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0, transition: { duration: 0.2 } },
    show: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };

  if (
    chatMessages &&
    parsedResponseSuggestions.length > 0 &&
    !isLastMessageFromLoggedUser
  ) {
    return (
      <motion.div
        variants={container}
        key={stringForResponseSuggestions}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
        className="flex flex-row justify-around mt-5 mb-2 relative"
      >
        <p className="text-bell text-sm font-bold">Suggestions: </p>
        {parsedResponseSuggestions.map((suggestion, index) => (
          <motion.div variants={item} key={suggestion}>
            <ResponseSuggestion key={suggestion} suggestion={suggestion} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return null;
}
