import Head from "next/head";
import Image from "next/image";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Chat from "../components/chat/chat";
import ActiveChats from "../components/activechats/activechats";
import { useCallback, useEffect, useState } from "react";
import { isBrowser } from "framer-motion";
import ws from 'ws'

export default function Home() {
  const [wsInstance, setWsInstance] = useState(null);

  // Call when updating the ws connection
  const updateWs = useCallback((url) => {
    if(!browser) return setWsInstance(null);

    // Close the old connection
    if(wsInstance?.readyState !== 3)
      wsInstance.close(...);

    // Create a new connection
    const newWs = new WebSocket(url);
    setWsInstance(newWs);
  }, [wsInstance])

  // (Optional) Open a connection on mount
  useEffect(() => {
    if(isBrowser) {
      const ws = new WebSocket(...);
      setWsInstance(ws);
    }

    return () => {
      // Cleanup on unmount if ws wasn't closed already
      if(ws?.readyState !== 3)
        ws.close(...)
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="description" content="This is a free open source chat" />
        <link rel="icon" href="/favicon.ico" />
        <title>Free open source Chat - Home</title>
      </Head>
      <div className="flex grow flex-1 grid grid-cols-12 h-full">
        {/*left side */}
        <ActiveChats />
        {/*right side*/}
        <Chat />
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
