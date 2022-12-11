import { useEffect } from "react";
import { useQueryClient } from "react-query";
import axios from "axios";

export default function usePrefetchActiveChats() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery(
      "activeChats",
      () => {
        alert("Prefetching active chats");
        return axios.get("/api/activechats");
      },
      {
        staleTime: 1000 * 60 * 5,
      }
    );
  }, []);
}
