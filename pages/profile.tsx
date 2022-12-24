import Head from "next/head";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import Image from "next/image";
import {
  faLock,
  faRefresh,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Yup from "yup";
import isEqual from "lodash.isequal";
import toast from "react-hot-toast";
import useActiveChats from "../components/hooks/useActiveChats";
import useJoinRooms from "../components/hooks/useJoinRooms";

const validationSchema = Yup.object({
  name: Yup.string()
    .max(30, "The name is too large.")
    .required("The name field is required."),
  lastName: Yup.string()
    .max(40, "The last name is too large.")
    .required("The last name field is required."),
  email: Yup.string()
    .email("Email is not valid")
    .max(255, "The email is too large.")
    .required("The email field is required."),
});

const updateProfile = async (user): Promise<[boolean, null | AxiosError]> => {
  console.log("submiting profile");
  try {
    const res = await axios.put("/api/profile", user);
    console.log(res);
    return [true, null];
  } catch (error) {
    return [false, error as AxiosError];
  }
};

const reloadSession = () => {
  console.log("reloading session");
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data, isFetched } = useActiveChats();
  useJoinRooms({ data, isFetched });

  const formik = useFormik({
    initialValues: {
      name: session?.user?.name ?? "",
      lastName: session?.user?.lastName ?? "",
      email: session?.user?.email ?? "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (
        !isEqual(values, {
          name: session.user.name,
          lastName: session.user.lastName,
          email: session.user.email,
        })
      ) {
        const updateToast = toast.loading("Updating Profile...", {
          position: "bottom-center",
        });
        const [res, error] = await updateProfile(values);
        if (!res) {
          if (error.response.status === 422) {
            formik.errors.email = error.response.data[0] as string;
            toast.dismiss(updateToast);
          }
        } else {
          reloadSession();
          toast.success("Your profile has been updated.", {
            position: "bottom-center",
            id: updateToast,
          });
        }
      }
    },
  });

  useEffect(() => {
    if (session) {
      formik.resetForm({
        values: {
          name: session.user.name,
          lastName: session.user.lastName,
          email: session.user.email,
        },
        errors: {},
      });
    }
  }, [session, router.asPath]);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-73.5px)] text-base py-12 2xl:py-0">
        <form className="w-80" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col justify-items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{ duration: 0.3 }}
              exit={{ scale: 0 }}
              className="h-48 w-48 relative self-center mb-10"
            >
              <Link href="/profilephoto">
                <a>
                  <Image
                    alt="NoImage"
                    src={`/images/${session?.user?.profilePhotoName}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full cursor-pointer"
                  />
                </a>
              </Link>
            </motion.div>
            <label htmlFor="name" className="text-bell text-base mb-2">
              Name:
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="text"
              name="name"
              className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell capitalize"
              placeholder="Enter your name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <AnimatePresence>
              {formik.errors.name && formik.touched.name && (
                <motion.p
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 text-sm mt-2"
                  exit={{ scale: 0 }}
                >
                  {formik.errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col mt-5">
            <label htmlFor="lastName" className="text-bell text-base mb-2">
              Last name:
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="text"
              name="lastName"
              className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell capitalize"
              placeholder="Enter your last name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.lastName}
            />
            <AnimatePresence>
              {formik.errors.lastName && formik.touched.lastName && (
                <motion.p
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 text-sm mt-2"
                  exit={{ scale: 0 }}
                >
                  {formik.errors.lastName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col mt-5">
            <label htmlFor="email" className="text-bell text-base mb-2">
              Email:
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="email"
              name="email"
              className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
              placeholder="Enter your email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <AnimatePresence>
              {formik.errors.email && formik.touched.email && (
                <motion.p
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 text-sm mt-2"
                  exit={{ scale: 0 }}
                >
                  {formik.errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-full mt-8"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon className="mr-2" icon={faRefresh} />
            <span>Update Profile</span>
          </motion.button>
          <motion.button
            type="button"
            className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-full mt-6"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              router.push("/changepassword");
            }}
          >
            <FontAwesomeIcon className="mr-2" icon={faLock} />{" "}
            <span>Change Password</span>
          </motion.button>
        </form>
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
