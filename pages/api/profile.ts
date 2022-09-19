import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../utils/types";
import * as Yup from "yup";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const validationScheme = Yup.object({
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

const validateFields = async (
  user: User
): Promise<[boolean, null | { errors: string[] }]> => {
  try {
    validationScheme.validate(user);
    return [true, null];
  } catch (errors: any) {
    console.log(errors.message);
    return [false, errors];
  }
};

const doesEmailExist = async (email: string): Promise<boolean> => {
  const userCount: number = await prisma.user.count({
    where: {
      email,
    },
  });
  return userCount > 0;
};

const updateUser = (id: String, user: User) => {
  console.log("updating user");
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
      const user: User = req.body;
      const fieldsValidation = await validateFields(user);
      if (fieldsValidation[0]) {
        if (session.user.email !== user.email) {
          const emailExists = await doesEmailExist(user.email);
          if (emailExists) {
            return res.status(422).json(["This email is already in use."]);
          }
        }
        await updateUser(session.user.id, user);
        return res.status(200).end();
      }
    } else {
      return res.status(401).send("User not authorized.");
    }
  }
}
