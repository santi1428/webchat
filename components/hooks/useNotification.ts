import axios from "axios";
import { useQuery } from "react-query";

const useNotification = ({ status }) =>
  useQuery("notification", () => axios.get("/api/notification"), {
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    enabled: status === "authenticated",
  });

export default useNotification;
