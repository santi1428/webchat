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
    activeUsers,
  } = props;

  const addUsersConnectionStatus = (data) => {
    let newUsersConnectionStatus = [
      ...usersConnectionStatus.filter(
        (user) => user.userId !== data.userId && user.userId !== session.user.id
      ),
      {
        userId: data.userId,
        status: data.status,
        name: data.name,
        profilePhotoName: data.profilePhotoName,
        time: Date.now(),
      },
    ];
    setUsersConnectionStatus(newUsersConnectionStatus);
  };

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
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      let newActiveUsers = [];
      usersConnectionStatus.forEach((userConnectionStatus) => {
        if (
          userConnectionStatus.userId !== session.user.id &&
          Date.now() - userConnectionStatus.time < timeToRefreshConnectionStatus
        ) {
          newActiveUsers.push({
            userId: userConnectionStatus.userId,
            name: userConnectionStatus.name,
            status: userConnectionStatus.status,
            profilePhotoName: userConnectionStatus.profilePhotoName,
          });
        }
      });
      setActiveUsers(newActiveUsers);
    }, 500);
    return () => clearInterval(interval);
  }, [usersConnectionStatus]);
}
