import { useEffect } from "react";

export default function useOnUserConnectionStatusSocketEvent(props) {
  const {
    socket,
    setUsersConnectionStatus,
    usersConnectionStatus,
    timeToRefreshConnectionStatus,
    setActiveUsers,
    session,
    socketConnected,
    blockedUsers,
  } = props;

  // useEffect(() => {
  //   console.log("usersConnectionStatus", usersConnectionStatus);
  //   // usersConnectionStatus.forEach((userConnectionStatus) => {
  //   //   console.log(
  //   //     userConnectionStatus,
  //   //     Date.now() - userConnectionStatus.time < timeToRefreshConnectionStatus,
  //   //     Date.now() - userConnectionStatus.time,
  //   //     timeToRefreshConnectionStatus
  //   //   );
  //   // });
  // }, [usersConnectionStatus]);

  // useEffect(() => {
  //   console.log("activeUsers", activeUsers);
  // }, [activeUsers]);

  useEffect(() => {
    const addUsersConnectionStatus = (data) => {
      let newUsersConnectionStatus = [
        ...usersConnectionStatus.filter(
          (user) =>
            user.userId !== data.userId && user.userId !== session?.user?.id
        ),
        {
          userId: data.userId,
          status: data.status,
          name: data.name,
          profilePhotoURL: data.profilePhotoURL,
          time: Date.now(),
          lastName: data.lastName,
        },
      ];
      setUsersConnectionStatus(newUsersConnectionStatus);
    };

    if (socket) {
      socket.on("userConnectionStatus", (data) => {
        addUsersConnectionStatus(data);
      });
    }
    return () => {
      if (socket) {
        socket.off("userConnectionStatus");
      }
    };
  }, [
    socket,
    socketConnected,
    setUsersConnectionStatus,
    usersConnectionStatus,
    session,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("blocked users", blockedUsers);

      let newActiveUsers = [];
      usersConnectionStatus.forEach((userConnectionStatus) => {
        if (
          userConnectionStatus.userId !== session?.user?.id &&
          Date.now() - userConnectionStatus.time <
            timeToRefreshConnectionStatus &&
          !blockedUsers?.data?.some(
            (blockedUser) => blockedUser.id === userConnectionStatus.userId
          )
        ) {
          newActiveUsers.push({
            userId: userConnectionStatus.userId,
            name: userConnectionStatus.name,
            status: userConnectionStatus.status,
            profilePhotoURL: userConnectionStatus.profilePhotoURL,
            lastName: userConnectionStatus.lastName,
          });
        }
      });
      setActiveUsers(newActiveUsers);
    }, 500);
    return () => clearInterval(interval);
  }, [
    usersConnectionStatus,
    blockedUsers,
    session?.user?.id,
    setActiveUsers,
    timeToRefreshConnectionStatus,
  ]);
}
