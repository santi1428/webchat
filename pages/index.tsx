import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Chat from "../components/chat/chat";
import ActiveChats from "../components/activechats/activechats";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const socketInitializer = async () => {
    await fetch("/api/socket");
    setSocket(io());
  };

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connected");
      });
    }
    console.log("socket", socket);
  }, [socket]);

  useEffect(() => {
    socketInitializer();
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="This is a free open source chat" />
        <link rel="icon" href="/favicon.ico" />
        <title>Free open source Chat - Home</title>
      </Head>
      <div className="flex grow flex-1 grid grid-cols-12 h-full">
        {/*left side */}
        <ActiveChats socket={socket} />
        {/*right side*/}
        <Chat socket={socket} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions as any
  );
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
