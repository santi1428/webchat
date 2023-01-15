import { useMemo } from "react";

export default function useIsUserMuted(props) {
  const { mutedUsers, activeChatId } = props;

  return useMemo(() => {
    return mutedUsers?.includes(activeChatId);
  }, [JSON.stringify(mutedUsers), activeChatId]);
}
