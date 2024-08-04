import Head from "next/head";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Chat from "../components/chat/chat";
import ActiveChats from "../components/activechats/activechats";
import BlockUserModal from "../components/blockUserModal";

export default function Home() {
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
        <BlockUserModal />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(
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
