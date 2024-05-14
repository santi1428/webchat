import { useEffect } from "react";

export default function useOnUserTypingEvent(props) {
  const {
    socket,
    socketConnected,
    status,
    session,
    usersTypingStatus,
    setUsersTypingStatus,
    setActiveUsersTyping,
    timeToRefreshTypingStatus,
  } = props;

  const addUsersTypingStatus = (data) => {
    let newUsersTypingStatus = [
      ...usersTypingStatus.filter(
        (user) =>
          user.userId !== data.senderId && user.userId !== session.user.id
      ),
      {
        userId: data.senderId,
        isTyping: data.isTyping,
        time: Date.now(),
      },
    ];
    setUsersTypingStatus(newUsersTypingStatus);
  };

  // useEffect(() => {
  //   console.log("usersTypingStatus", usersTypingStatus);
  // }, [usersTypingStatus]);

  // useEffect(() => {
  //   console.log("activeUsersTyping", activeUsersTyping);
  // }, [activeUsersTyping]);

  useEffect(() => {
    if (socketConnected && socket) {
      socket.on("userTyping", (data) => {
        addUsersTypingStatus(data);
      });
    }

    return () => {
      if (socket) {
        socket.off("userTyping");
      }
    };
  }, [socketConnected, usersTypingStatus, socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      let newActiveUsersTyping = [];
      usersTypingStatus.forEach((userTypingStatus) => {
        if (Date.now() - userTypingStatus.time < timeToRefreshTypingStatus) {
          newActiveUsersTyping.push({
            userId: userTypingStatus.userId,
            name: userTypingStatus.name,
            status: userTypingStatus.status,
            profilePhotoName: userTypingStatus.profilePhotoName,
          });
        }
      });
      setActiveUsersTyping(newActiveUsersTyping);
    }, 100);
    return () => clearInterval(interval);
  }, [usersTypingStatus]);
}
