import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import dayjs from "dayjs";
import ActiveChat from "./activechat";
import ActiveChatsFilter from "./activeChatsFilter";

export default function ActiveChats(): JSX {
  const { data: session, status } = useSession();

  const { data, isFetching } = useQuery(
    "activeChats",
    () => {
      return axios.get("/api/activechats");
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

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
        .filter((chat) => chat.id !== session?.user?.id)
        .map((chat) => (
          <ActiveChat key={chat.id} activeChat={chat} />
        ))}
    </div>
  );
}
