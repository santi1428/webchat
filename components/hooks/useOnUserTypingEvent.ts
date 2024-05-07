import { useEffect } from "react";
import { useSocketStore } from "../../lib/store";


export default function useOnUserTypingEvent(props) {
    const { socket, socketConnected } = props;

    const usersTypingStatus = useSocketStore((state) => state.usersTypingStatus);
    const setUsersTypingStatus = useSocketStore(
        (state) => state.setUsersTypingStatus
    );


    const addUsersTypingStatus = (data) => {
        let newUsersTypingStatus = [...usersTypingStatus.filter((user) => user.userId !== data.senderId), {
            userId: data.senderId,
            isTyping: data.isTyping,
            time: Date.now(),
        }];
        setUsersTypingStatus(newUsersTypingStatus);
    };

    useEffect(() => {
        console.log(
            "usersTypingStatus from useEffect on useOnUserTypingEvent",
            usersTypingStatus
        );
    }, [usersTypingStatus]);

    useEffect(() => {
        if (socketConnected) {
            socket.on("userTyping", (data) => {
                addUsersTypingStatus(data);
            });
        }
    }, [socketConnected, usersTypingStatus]);
}