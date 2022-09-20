import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../lib/bcrypt";
import { comparePassword } from "../../lib/bcrypt";
import { User } from "../../utils/types";
import * as Yup from "yup";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";

const validationScheme = Yup.object({
  oldPassword: Yup.string()
    .min(6, "Password is too short - should be 6 chars minimum.")
    .max(40, "The password should not exceed 50 characters")
    .required("This field is required."),
  newPassword: Yup.string()
    .min(6, "Password is too short - should be 6 chars minimum.")
    .max(40, "The password should not exceed 50 characters")
    .required("This field is required."),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("This field is required."),
});

const getUserPasswordByID = async (id): Promise<String> => {
  console.log("querying database getUserByID");
  const user: User = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      password: true,
    },
  });
  return user.password;
};

const updateUserPasswordByID = async (id: String, newPassword: String) => {
  try {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const validateFields = async (
  fields
): Promise<[boolean, null | { errors: string[] }]> => {
  try {
    validationScheme.validate(fields);
    return [true, null];
  } catch (errors: any) {
    console.log(errors.message);
    return [false, errors];
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "PUT") {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
      const fieldsValidation = await validateFields(req.body);
      if (fieldsValidation[0]) {
        const userPassword = await getUserPasswordByID(session.user.id);
        if (await comparePassword(req.body.oldPassword, userPassword)) {
          const newPasswordHash = await hashPassword(req.body.newPassword);
          await updateUserPasswordByID(session.user.id, newPasswordHash);
          return res.status(204).end();
        } else {
          return res.status(422).json(["The password entered is not correct."]);
        }
      } else {
        return res.status(400).end();
      }
    } else {
      return res.status(401).send("User not authorized.");
    }
  }
}
