import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Chat from "../components/chat/chat";
import ActiveChats from "../components/activechats/activechats";
import useActiveChats from "../components/hooks/useActiveChats";
import useJoinRooms from "../components/hooks/useJoinRooms";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();
  const { data, isFetched } = useActiveChats({ status });
  useJoinRooms({ data, isFetched });

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
