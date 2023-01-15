import axios from "axios";
import { useQuery } from "react-query";

const useActiveChats = ({ status }) =>
  useQuery(
    "activeChats",
    () => {
      return axios.get("/api/activechats");
    },
    {
      staleTime: 1000 * 60 * 5,
      enabled: status === "authenticated",
    }
  );

export default useActiveChats;
