import axios from "axios";
import { useQuery } from "react-query";

const useActiveChats = () =>
  useQuery(
    "activeChats",
    () => {
      console.log("fetching active chats");
      return axios.get("/api/activechats");
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

export default useActiveChats;
