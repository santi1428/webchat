import { useRouter } from "next/router";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useSession } from "next-auth/react";
import useBlockedUsers from "../components/hooks/useBlockedUsers";
import Image from "next/image";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import useBlockUser from "../components/hooks/useBlockUser";
import { useEffect, useRef } from "react";

export default function BlockedUsers() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { data: blockedUsers } = useBlockedUsers({ status });

  const { unblockUser, isUnblockUserSuccess, isUnblockingUser } =
    useBlockUser();

  const unblockingUserToastRef = useRef(null);

  const removeBlockedUser = async (id, name, lastName) => {
    unblockingUserToastRef.current = {
      toast: toast.loading("Unblocking user..."),
      fullName: `${name} ${lastName}`,
    };
    console.log("Removing blocked user.", id);
    unblockUser(id);
  };

  useEffect(() => {
    if (isUnblockUserSuccess && !isUnblockingUser) {
      toast.success(
        `${unblockingUserToastRef.current.fullName} has been unblocked.`,
        {
          position: "bottom-center",
          id: unblockingUserToastRef.current.toast,
        }
      );
    }
  }, [isUnblockUserSuccess, isUnblockingUser]);

  return (
    <>
      <Head>
        <title>Blocked Users</title>
      </Head>
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-73.5px)] text-base py-12 2xl:py-0">
        <div className="flex flex-col justify-items-center p-5">
          <h3 className="text-bell font-semibold text-xl text-center border-b-1 border-bell pb-3">
            Blocked Users
          </h3>
          <div className="flex flex-col mt-5">
            {blockedUsers?.data.map((blockedUser) => (
              <div
                key={blockedUser.id}
                className="grid grid-cols-6 max-w-5xl mt-4"
              >
                <div className="col-span-1">
                  <div className="self-center md:self-auto md:ml-6 inline-block h-8 w-8 md:h-12 md:w-12 relative">
                    <Image
                      layout="fill"
                      src={
                        blockedUser.profilePhotoName
                      }
                      className="rounded-full"
                      alt="NoImage"
                    />
                  </div>
                </div>
                <div className="col-span-4 flex flex-col">
                  <p className="font-bold text-bell ml-4">
                    {blockedUser.name} {blockedUser.lastName}
                  </p>
                  <p className="text-bell ml-4 text-sm">{blockedUser.email}</p>
                </div>
                <button
                  className="col-span-1 self-center text-bell text-sm"
                  onClick={() => {
                    removeBlockedUser(
                      blockedUser.id,
                      blockedUser.name,
                      blockedUser.lastName
                    );
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="text-bell ml-4 text-2xl"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
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
