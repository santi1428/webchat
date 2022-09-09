import Head from "next/head";
import { useFormik } from "formik";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import * as Yup from "yup";
import {useRouter} from "next/router";

export default function Login() {
  const router = useRouter();
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
      password: Yup.string()
        .min(6, "Password is too short - should be 6 chars minimum.")
        .max(40, "The password should not exceed 50 characters")
        .required("The password field is required."),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        console.log(res);
        if (!res.ok && res.status == 401){
          formik.errors.email = 'Email or password is not correct.';
        }else if (res.ok && res.status == 200){
          router.push('/');
        }
    },
  });

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex flex-col justify-center items-center h-[calc(100vh-73px)]">
        <form className="w-80" onSubmit={formik.handleSubmit}>
          <p className="text-bell font-semibold text-2xl text-center">
            Sign In
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
          <div className="flex flex-col mt-5">
            <label htmlFor="password" className="text-bell text-lg mb-2">
              Password:
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="password"
              name="password"
              className="rounded-2xl w-full pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
              placeholder="Enter your password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <AnimatePresence>
              {formik.errors.password && formik.touched.password && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.0 }}
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
          <p className="mt-4 text-bell">
            Don't you have an account?
            <Link href="/auth/register">
              <a className="font-bold cursor-pointer ml-2">Sign Up here.</a>
            </Link>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="rounded-full text-center bg-bell font-bold py-3 px-3 w-full mt-6"
          >
            Sign In
          </motion.button>
        </form>
      </div>
    </>
  );
}
