import Head from "next/head";
import { useFormik } from "formik";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import {
  faCircleCheck,
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function Forgotpassword() {
  const router = useRouter();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRecoveryLink = async (
    email
  ): Promise<[boolean, null | AxiosError]> => {
    try {
      const res = await axios.post("/api/forgotpassword", email);
      console.log(res);
      return [true, null];
    } catch (error) {
      return [false, error as AxiosError];
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email is not valid")
        .max(255, "The email is too large.")
        .required("The email field is required."),
    }),
    onSubmit: async (values) => {
      if (!isSubmitting) {
        setIsSubmitting(true);
        const sendingEmail = toast.loading("Sending email...", {
          position: "bottom-center",
        });
        const [res, error] = await emailRecoveryLink(values);
        if (!res) {
          toast.error("An error has occurred. Please try again later.", {
            position: "bottom-center",
            id: sendingEmail,
          });
        } else {
          setIsEmailSent(true);
          toast.success("Email has been sent.", {
            position: "bottom-center",
            id: sendingEmail,
          });
        }
      }
    },
  });

  return (
    <>
      <Head>
        <title>Forgot your password</title>
      </Head>
      <AnimatePresence mode="wait">
        {!isEmailSent ? (
          <motion.div
            key={"sendEmail"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ scale: 0 }}
            className="flex flex-col justify-center items-center h-[calc(100vh-73px)]"
          >
            <form
              className="w-96 border-1 border-customBorderColor rounded-3xl p-8"
              onSubmit={formik.handleSubmit}
            >
              <p className="text-bell font-semibold text-2xl text-center">
                Forgot your password
              </p>
              <div className="flex flex-col mt-5">
                <label htmlFor="email" className="text-bell text-lg mb-2">
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
                      initial={{ opacity: 0, scale: 0.0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      exit={{ scale: 0 }}
                      className="text-red-600 text-sm mt-2"
                    >
                      {formik.errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="rounded-full text-center bg-bell font-bold py-3 px-3 w-full mt-6"
              >
                Email me a recovery link
              </motion.button>
              <p className="text-bell mt-4 text-sm">
                An email will be sent to your inbox. Please click the link when
                you get it.
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key={"sentEmail"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ scale: 0 }}
            className="flex flex-col justify-center items-center h-[calc(100vh-73px)]"
          >
            <div className="text-center text-green-800 w-80 border-1 border-customBorderColor p-10 rounded-3xl">
              <FontAwesomeIcon
                icon={faCircleCheck}
                size="8x"
                className="text-green-900"
              />
              <p className="text-justify text-md text-bell mt-8 font-semibold">
                An email was sent to your inbox containing the link to reset
                your account password. Please click the link when you receive
                it.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions as any
  );
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
