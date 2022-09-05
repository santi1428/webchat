import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";


export default function Register() {
  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(30, "The name is too large.")
        .required("The name field is required."),
      lastName: Yup.string()
        .max(40, "The last name is too large.")
        .required("The last name field is required."),
      email: Yup.string()
        .email('Email is not valid')
        .max(255, "The email is too large.")
        .required("The email field is required."),
      password: Yup.string()
        .min(6, "Password is too short - should be 6 chars minimum.")
        .max(40, "The password should not exceed 50 characters")
        .required("The password field is required."),
      confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match').required('You need to confirm your password')
    }),
    onSubmit: (values) => {
      console.log(values);
    }
  });

  // console.log(formik.values);
  console.log(formik.touched);

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="h-screen bg-background">
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-bell font-semibold text-2xl">Sign Up</p>
          <form className="w-80" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col mt-5">
              <label htmlFor="name" className="text-bell text-lg mb-2">
                Name:
              </label>
              <input
                type="text"
                name="name"
                className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
                placeholder="Enter your name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.errors.name && formik.touched.name && <p className='text-red-600 text-sm mt-2'>{formik.errors.name}</p>}
            </div>
            <div className="flex flex-col mt-5">
              <label htmlFor="lastName" className="text-bell text-lg mb-2">
                Last name:
              </label>
              <input
                type="text"
                name="lastName"
                className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
                placeholder="Enter your last name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
              {formik.errors.lastName && formik.touched.lastName && <p className='text-red-600 text-sm mt-2'>{formik.errors.lastName}</p>}
            </div>
            <div className="flex flex-col mt-5">
              <label htmlFor="email" className="text-bell text-lg mb-2">
                Email:
              </label>
              <input
                type="email"
                name="email"
                className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
                placeholder="Enter your email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && <p className='text-red-600 text-sm mt-2'>{formik.errors.email}</p>}
            </div>
            <div className="flex flex-col mt-5">
              <label htmlFor="password" className="text-bell text-lg mb-2">
                Password:
              </label>
              <input
                type="password"
                name="password"
                className="rounded-2xl w-full pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
                placeholder="Enter your password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password && <p className='text-red-600 text-sm mt-2'>{formik.errors.password}</p>}
            </div>
            <div className="flex flex-col mt-5">
              <label htmlFor="password" className="text-bell text-lg mb-2">
                Confirm your password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="rounded-2xl w-full  pl-4 pt-2 pb-2 pr-2 bg-background2 border-solid border border-bell text-bell"
                placeholder="Confirm your password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
              {formik.errors.confirmPassword && formik.touched.confirmPassword && <p className='text-red-600 text-sm mt-2'>{formik.errors.confirmPassword}</p>}
            </div>
            <p className="mt-4 text-bell">
              Already have an account?{" "}
              <span className="font-bold">Sign In</span>
            </p>
            <button type="submit" className="rounded-full text-center bg-bell font-bold py-3 px-3 w-full mt-6">
              Sign Up
            </button>
            <p className="mt-3 text-sm text-bell">
              By clicking on sign-up, you agree to this website the Terms and
              Conditions and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
