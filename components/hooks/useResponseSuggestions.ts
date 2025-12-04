import axios from "axios";
import { useQuery } from "react-query";

const useResponseSuggestions = ({ status, data }) =>
  useQuery(
    ["responseSuggestions", data],
    () => {
      return axios.get("/api/responseSuggestion", { params: { prompt: data } });
    },
    {
      enabled: status === "authenticated" && data.length > 0,
      refetchOnWindowFocus: false,
    }
  );

export default useResponseSuggestions;
