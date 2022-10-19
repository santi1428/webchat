import * as Yup from "yup";

export default Yup.object({
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
        .max(40, "The password should not exceed 40 characters")
        .required("The password field is required."),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match').required('You need to confirm your password')
})