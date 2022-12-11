import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import ActiveChat from "./activechat";
import ActiveChatsFilter from "./activeChatsFilter";
import { useChatStore, useSocketStore } from "../../lib/store";
import { useEffect } from "react";
import useActiveChats from "../hooks/useActiveChats";

export default function ActiveChats(props): JSX {
  const { data: session, status } = useSession();
  const activeChatsFilter = useChatStore((state) => state.activeChatsFilter);
  const socket = useSocketStore((state) => state.socket);
  const socketConnected = useSocketStore((state) => state.socketConnected);
  const setHasJoinedRooms = useSocketStore((state) => state.setHasJoinedRooms);
  const hasJoinedRooms = useSocketStore((state) => state.hasJoinedRooms);

  const { data, isFetched } = useActiveChats();

  const getRoomID = useChatStore((state) => state.getRoomID);

  useEffect(() => {
    console.log("hasJoinedRooms", hasJoinedRooms);
    if (
      !hasJoinedRooms &&
      socketConnected &&
      status === "authenticated" &&
      isFetched
    ) {
      console.log(
        "Joining Rooms",
        data.data.map((activeChat) => getRoomID(session.user.id, activeChat.id))
      );
      socket.emit(
        "joinRooms",
        data.data.map((activeChat) => getRoomID(session.user.id, activeChat.id))
      );
      setHasJoinedRooms(true);
    }
  }, [socketConnected, status, hasJoinedRooms, isFetched]);

  return (
    <div className="min-h-[calc(100vh-73.5px)] max-h-[calc(100vh-73.5px)] col-span-4 flex flex-col border-r border-customBorderColor overflow-y-auto overflow-x-hidden scrollbar scrollbar-thin scrollbar-thumb-bell scrollbar-track-background">
      <ActiveChatsFilter />
      <h3 className="ml-7 mt-6 text-bell text-lg font-semibold">Active now</h3>
      <div className="grid grid-cols-5 justify-items-center mt-5 pl-0 pb-5 border-b border-customBorderColor">
        <div className="inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie1.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="mr-3 inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie2.jpeg"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="mr-3 inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie3.jpg"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="mr-3 inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie4.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
        <div className="mr-3 inline-block h-12 w-12 relative">
          <Image
            layout="fill"
            src="/images/selfie.webp"
            className="rounded-full"
            alt="NoImage"
          />
        </div>
      </div>

      {/*Seccion de lista de chats*/}

      {[...new Map(data?.data.map((item) => [item["id"], item])).values()]
        .filter(
          (chat) =>
            chat.id !== session?.user?.id &&
            (chat.lastMessage?.content
              .toLowerCase()
              .includes(activeChatsFilter.toLowerCase()) ||
              chat.name
                .toLowerCase()
                .includes(activeChatsFilter.toLowerCase()) ||
              chat.lastName
                .toLowerCase()
                .includes(activeChatsFilter.toLowerCase()))
        )
        .map((chat) => (
          <ActiveChat key={chat.id} activeChat={chat} />
        ))}
    </div>
  );
}
