import axios from "axios";
import { useQuery } from "react-query";

const useMutedUsers = ({ status }) =>
  useQuery(
    "mutedUsers",
    () => {
      return axios.get("/api/muteduser");
    },
    {
      staleTime: 1000 * 60 * 5,
      enabled: status === "authenticated",
    }
  );

export default useMutedUsers;
