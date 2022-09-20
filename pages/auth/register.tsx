import Head from "next/head";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import validationScheme from "../../utils/validation-scheme";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const registerUser = async (user): Promise<[boolean, null | AxiosError]> => {
  try {
    const res = await axios.post("/api/register", user);
    console.log(res);
    return [true, null];
  } catch (error) {
    return [false, error as AxiosError];
  }
};

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationScheme,
    onSubmit: async (values) => {
      const [res, error] = await registerUser(values);
      if (!res) {
        if (error.response.status === 422) {
          formik.errors.email = error.response.data[0] as string;
        }
      } else {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        await router.push("/profilephoto");
        toast.success(
          "You have signed up, now you can setup a profile photo.",
          {
            position: "bottom-center",
            duration: 8000,
          }
        );
      }
    },
  });

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-73px)] text-base">
        <form className="w-80" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col">
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
          <div className="flex flex-col mt-5 relative">
            <label htmlFor="password" className="text-bell text-base mb-2">
              Password:
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type={showPassword ? "text" : "password"}
              name="password"
              className="rounded-2xl w-full pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
              placeholder="Enter your password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <AnimatePresence mode="wait">
              <motion.button
                key={showPassword ? "faEye" : "faEyeSlash"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                type="button"
                onClick={() => {
                  setShowPassword((showPassword) => !showPassword);
                }}
                className="absolute top-11 right-4"
              >
                <FontAwesomeIcon
                  className={"text-bell text-lg"}
                  icon={showPassword ? faEye : faEyeSlash}
                />
              </motion.button>
            </AnimatePresence>
            <AnimatePresence>
              {formik.errors.password && formik.touched.password && (
                <motion.p
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 text-sm mt-2"
                  exit={{ scale: 0 }}
                >
                  {formik.errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col mt-5 relative">
            <label htmlFor="password" className="text-bell text-base mb-2">
              Confirm your password
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
              placeholder="Confirm your password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
            />
            <AnimatePresence mode="wait">
              <motion.button
                key={showConfirmPassword ? "faEye" : "faEyeSlash"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                type="button"
                onClick={() => {
                  setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword);
                }}
                className="absolute top-11 right-4"
              >
                <FontAwesomeIcon
                  className={"text-bell text-lg"}
                  icon={showConfirmPassword ? faEye : faEyeSlash}
                />
              </motion.button>
            </AnimatePresence>
            <AnimatePresence>
              {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-600 text-sm mt-2"
                  exit={{ scale: 0 }}
                >
                  {formik.errors.confirmPassword}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-4 text-bell">
            Already have an account?
            <Link href="/auth/login">
              <a className="font-bold cursor-pointer ml-2">Sign In.</a>
            </Link>
          </p>
          <motion.button
            type="submit"
            className="rounded-full text-center bg-bell text-base font-bold py-3 px-3 w-full mt-6"
            whileHover={{ scale: 1.05 }}
          >
            Sign Up
          </motion.button>
          <p className="mt-3 text-sm text-bell">
            By clicking on sign-up, you agree to this website the Terms and
            Conditions and Privacy Policy.
          </p>
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
