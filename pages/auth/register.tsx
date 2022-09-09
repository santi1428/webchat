import Head from "next/head";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import validationScheme from "../../utils/validation-scheme";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
      console.log(values);
      const [res, error] = await registerUser(values);
      if (!res) {
        if (error.response.status === 422) {
          formik.errors.email = error.response.data[0];
        }
      } else {
        await router.push("/auth/login");
      }
    },
  });

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div
          className="flex flex-col justify-center items-center min-h-[calc(100vh-73px)] text-base"
      >
        <form className="w-80" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-bell text-base mb-2">
              Name:
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="text"
              name="name"
              className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
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
              className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
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
          <div className="flex flex-col mt-5">
            <label htmlFor="password" className="text-bell text-base mb-2">
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
          <div className="flex flex-col mt-5">
            <label htmlFor="password" className="text-bell text-base mb-2">
              Confirm your password
            </label>
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="password"
              name="confirmPassword"
              className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
              placeholder="Confirm your password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
            />
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


