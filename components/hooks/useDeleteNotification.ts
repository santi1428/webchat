import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export default function useDeleteNotification() {
  const queryClient = useQueryClient();

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
        await queryClient.invalidateQueries({
          queryKey: ["notification"],
          refetchActive: true,
          refetchInactive: true,
        });
      },
    }
  );

  return {
    deleteNotification,
    isDeletingUserNotification,
    isUserNotificationDeleted,
  };
}
