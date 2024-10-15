import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

export default function useNotification({ status }) {
  const queryClient = useQueryClient();

  const notifications = () =>
    useQuery(
      "notifications",
      () => {
        const res = axios.get("/api/notification");
        return res;
      },
      {
        enabled: status === "authenticated",
        refetchInterval: 1000 * 60,
      }
    );

  const {
    mutate: deleteNotification,
    isLoading: isDeletingUserNotification,
    isSuccess: isUserNotificationDeleted,
  } = useMutation(
    async ({ id, type }: { id: string; type: string }) => {
      console.log("deleting notifications, type: ", type);
      await axios.delete("/api/notification", {
        data: {
          id,
          type,
        },
      });
    },
    {
      onSuccess: async () => {
        console.log("invalidating notifications");
        queryClient.invalidateQueries("notifications");
      },
    }
  );

  return {
    notifications,
    deleteNotification,
    isDeletingUserNotification,
    isUserNotificationDeleted,
  };
}
