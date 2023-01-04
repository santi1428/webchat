import { useMemo } from "react";

export default function useIsUserMuted(props) {
  const { mutedUsers, activeChatId } = props;

  return useMemo(() => {
    console.log("mutedUsers inside custom hook", mutedUsers);
    return mutedUsers?.includes(activeChatId);
  }, [JSON.stringify(mutedUsers), activeChatId]);
}
