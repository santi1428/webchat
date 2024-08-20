import Head from "next/head";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import {
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useState } from "react";

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password is too short - should be 6 chars minimum.")
    .max(40, "The password should not exceed 50 characters")
    .required("This field is required."),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("This field is required."),
});

export default function Register() {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const resetPassword = async (
    fields
  ): Promise<[boolean, null | AxiosError]> => {
    try {
      const res = await axios.post("/api/resetpassword", {
        ...fields,
        token: router.query.token,
      });
      console.log(res);
      return [true, null];
    } catch (error) {
      return [false, error as AxiosError];
    }
  };

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!isSubmittingForm) {
        setIsSubmittingForm(true);
        const resettingPassword = toast.loading("Resetting password...", {
          position: "bottom-center",
        });
        const [res, error] = await resetPassword(values);
        if (!res) {
          if (error.response.status === 422) {
            router.push("/auth/forgotpassword");
            toast.error(error.response.data[0] as string, {
              position: "bottom-center",
              duration: 7000,
              id: resettingPassword,
            });
          }
        } else {
          router.push("/auth/login");
          toast.success(
            "Your password has been reset. Now you can sign in with your new password.",
            {
              position: "bottom-center",
              duration: 7000,
              id: resettingPassword,
            }
          );
        }
      }
    },
  });

  return (
    <>
      <Head>
        <title>Reset account password.</title>
      </Head>
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-73px)] text-base">
        <form
          className="w-96 border-1 border-customBorderColor p-6 rounded-3xl"
          onSubmit={formik.handleSubmit}
        >
          <h3 className="text-bell text-xl text-center font-semibold mb-5">
            Reset account password
          </h3>
          <div className="flex flex-col relative mt-5">
            <label htmlFor="newPassword" className="text-bell text-base mb-2">
              New Password:
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              className="rounded-2xl w-full pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
              placeholder="Enter your new password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.newPassword}
            />
            <AnimatePresence mode="wait">
              <motion.button
                key={showNewPassword ? "faEye" : "faEyeSlash"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ scale: 0 }}
                type="button"
                onClick={() => {
                  setShowNewPassword((showNewPassword) => !showNewPassword);
                }}
                className="absolute top-11 right-4"
              >
                <FontAwesomeIcon
                  className={"text-bell text-lg"}
                  icon={showNewPassword ? faEye : faEyeSlash}
                />
              </motion.button>
            </AnimatePresence>
            <AnimatePresence>
              {formik.errors.newPassword && formik.touched.newPassword && (
                <motion.p
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 text-sm mt-2"
                  exit={{ scale: 0 }}
                >
                  {formik.errors.newPassword}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col relative mt-5">
            <label htmlFor="password" className="text-bell text-base mb-2">
              Confirm your new password
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type={showConfirmNewPassword ? "text" : "password"}
              name="confirmNewPassword"
              className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
              placeholder="Confirm your new password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.confirmNewPassword}
            />
            <AnimatePresence mode="wait">
              <motion.button
                key={showConfirmNewPassword ? "faEye" : "faEyeSlash"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ scale: 0 }}
                type="button"
                onClick={() => {
                  setShowConfirmNewPassword(
                    (showConfirmNewPassword) => !showConfirmNewPassword
                  );
                }}
                className="absolute top-11 right-4"
              >
                <FontAwesomeIcon
                  className={"text-bell text-lg"}
                  icon={showConfirmNewPassword ? faEye : faEyeSlash}
                />
              </motion.button>
            </AnimatePresence>
            <AnimatePresence>
              {formik.errors.confirmNewPassword &&
                formik.touched.confirmNewPassword && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-600 text-sm mt-2"
                    exit={{ scale: 0 }}
                  >
                    {formik.errors.confirmNewPassword}
                  </motion.p>
                )}
            </AnimatePresence>
          </div>
          <motion.button
            type="submit"
            className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-full mt-6"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon className="mr-2" icon={faLock} />{" "}
            <span>Reset Account Password</span>
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
