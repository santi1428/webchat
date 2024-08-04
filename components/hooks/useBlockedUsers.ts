import axios from "axios";
import { useQuery } from "react-query";

const useBlockedUsers = ({ status }) =>
  useQuery(
    "blockedUsers",
    () => {
      return axios.get("/api/blockeduser");
    },
    {
      staleTime: 1000 * 60 * 5,
      enabled: status === "authenticated",
    }
  );

export default useBlockedUsers;
