import { useQueryClient, useMutation } from "react-query";
import axios from "axios";

export default function useBlockUser() {
  const queryClient = useQueryClient();

  const {
    mutate: blockUser,
    isLoading: isLoadingBlockUser,
    isSuccess: isBlockUserSuccess,
  } = useMutation(
    async (userId: string) => {
      await axios.post("/api/blockeduser", {
        blockedUserId: userId,
      });
    },
    {
      onSuccess: async () => {
        queryClient.clear();
      },
    }
  );

  const {
    mutate: unblockUser,
    isLoading: isUnblockingUser,
    isSuccess: isUnblockUserSuccess,
  } = useMutation(
    async (userId: string) => {
      await axios.delete("/api/blockeduser", {
        data: {
          blockedUserId: userId,
        },
      });
    },
    {
      onSuccess: async () => {
        // queryClient.invalidateQueries("blockedUsers");
        queryClient.clear();
      },
    }
  );

  return {
    blockUser,
    isBlockUserSuccess,
    isLoadingBlockUser,
    unblockUser,
    isUnblockingUser,
    isUnblockUserSuccess,
  };
}
