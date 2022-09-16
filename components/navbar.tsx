import {
  faUserPlus,
  faRightToBracket,
  faRightFromBracket,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
// @ts-ignore
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "../utils/types";

export default function Navbar() {
  const { data: session, status } = useSession();
  console.log(session);
  const router = useRouter();
  return (
    <div className="flex flex-row justify-between pt-4 pb-3 border-b-1 border-customBorderColor ">
      <div className="ml-5">
        <Link href="/">
          <a>
            <div className="flex flex-row">
              <img
                className="inline self-center"
                src="/images/icons8-chat-48.png"
                alt="Logo"
              />
              <h5 className="self-center text-xl ml-3 text-bell inline">
                Open source chat
              </h5>
            </div>
          </a>
        </Link>
      </div>
      {status !== "loading" && (
        <div className="flex flex-row mr-5">
          {status === "unauthenticated" ? (
            <>
              <Link href="/auth/register" className="self-center">
                <a className="self-center">
                  <FontAwesomeIcon
                    className="text-bell mr-2"
                    icon={faUserPlus}
                  />
                  <span className="text-lg text-bell  font-semibold cursor-pointer mr-7">
                    Sign Up
                  </span>
                </a>
              </Link>
              <Link href="/auth/login">
                <a className="self-center">
                  <FontAwesomeIcon
                    className="text-bell mr-2"
                    icon={faRightToBracket}
                  />
                  <span className="text-lg text-bell font-semibold cursor-pointer mr-7">
                    Sign In
                  </span>
                </a>
              </Link>
            </>
          ) : (
            <>
              <a href="/" className="button mt-2 text-bell mr-1">
                <FontAwesomeIcon icon={faBell} size="lg" />
              </a>
              <div className="ml-5 mr-3 inline-block h-10 w-10 relative">
                <Link href="/profilephoto">
                  <a>
                    <Image
                      layout="fill"
                      src="/images/selfie.webp"
                      className="rounded-full"
                    />
                  </a>
                </Link>
              </div>
              <div className="flex flex-col">
                <p className="text-bell font-semibold">{`${session.user.name} ${session.user.lastName}`}</p>
                <p className="text-xs text-bell">{session.user.email}</p>
              </div>
              <button
                className="ml-10"
                onClick={async () => {
                  await signOut({ redirect: false });
                  await router.push("/auth/login");
                }}
              >
                <FontAwesomeIcon
                  className="text-bell mr-2"
                  icon={faRightFromBracket}
                />
                <span className="text-lg text-bell  font-semibold cursor-pointer mr-7">
                  Sign Out
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
