import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUpload } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";

export default function ProfilePhoto() {
  return (
    <>
      <Head>
        <title>Change your profile photo.</title>
      </Head>

      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-77px)] text-base">
        <div className="h-72 w-72 relative">
          <Image
            src="/images/default-profile-photo.png"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="mt-6">
          <motion.button
            className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-64"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon icon={faUpload} />

            <span className="ml-2">Update Profile Photo</span>
          </motion.button>
        </div>
        <div className="mt-6">
          <motion.button
            className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-64"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon icon={faHouse} />
            <span className="ml-2">Go to Home Page</span>
          </motion.button>
        </div>
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
