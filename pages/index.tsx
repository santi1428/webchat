import Head from "next/head";
import Image from "next/image";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Chat from "../components/chat/chat";

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
        <div className="min-h-[calc(100vh-73.5px)] col-span-4 flex flex-col border-r border-customBorderColor">
          <div className="ml-7 w-full">
            <input
              type="text"
              className="rounded-2xl w-4/5 mt-6 pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-customBorderColor text-bell"
              placeholder="Search"
            />
          </div>
          <h3 className="ml-7 mt-6 text-bell text-lg font-semibold">
            Active now
          </h3>
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

          <div className="flex flex-row w-full border-b border-customBorderColor py-5">
            <div className="ml-7 inline-block h-12 w-12 relative">
              <Image
                layout="fill"
                src="/images/selfie4.webp"
                className="rounded-full"
                alt="NoImage"
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between pb-1">
                <p className="ml-5 text-bell font-semibold">Alison Parker</p>
                <div className="flex flex-row">
                  <p className="text-bell mr-4">12:30</p>
                  <a href="">
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      size="lg"
                      className="pr-6 text-bell"
                    />
                  </a>
                </div>
              </div>
              <p className="ml-5 text-bell">OMG! This is amazing :).</p>
            </div>
          </div>
          <div className="flex flex-row w-full border-b border-customBorderColor py-5">
            <div className="ml-7 inline-block h-12 w-12 relative">
              <Image
                layout="fill"
                src="/images/selfie1.webp"
                className="rounded-full"
                alt="NoImage"
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between pb-1">
                <p className="ml-5 text-bell font-semibold">Selena Gomez</p>
                <div className="flex flex-row">
                  <p className="text-bell mr-4">12:30</p>
                  <a href="">
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      size="lg"
                      className="pr-6 text-bell"
                    />
                  </a>
                </div>
              </div>
              <p className="ml-5 text-bell">OMG! This is amazing :).</p>
            </div>
          </div>
          <div className="flex flex-row w-full py-5 border-b border-customBorderColor py-5">
            <div className="ml-7 inline-block h-12 w-12 relative">
              <Image
                layout="fill"
                src="/images/selfie3.jpg"
                className="rounded-full"
                alt="NoImage"
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between pb-1">
                <p className="ml-5 text-bell font-semibold">Jack Harlow</p>
                <div className="flex flex-row">
                  <p className="text-bell mr-4">12:30</p>
                  <a href="">
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      size="lg"
                      className="pr-6 text-bell"
                    />
                  </a>
                </div>
              </div>
              <p className="ml-5 text-bell">OMG! This is amazing :).</p>
            </div>
          </div>
          <div className="grow h-full flex-1"></div>
        </div>
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
