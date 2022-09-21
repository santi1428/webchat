import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../lib/bcrypt";
import { comparePassword } from "../../lib/bcrypt";
import { User } from "../../utils/types";
import * as Yup from "yup";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";

const validationScheme = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password is too short - should be 6 chars minimum.")
    .max(40, "The password should not exceed 50 characters")
    .required("This field is required."),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("This field is required."),
});

const checkIfTokenIsValid = async (token: String): Promise<boolean> => {
  if (token.trim()) {
    console.log("token is not null or empty");
    const res = await prisma.user.findUnique({
      where: {
        resetPasswordToken: token,
      },
      select: {
        resetPasswordToken: true,
        resetPasswordTokenExpiry: true,
      },
    });
    if (res) {
      console.log("token exists");
      const currentTime = new Date().getTime();
      if (currentTime <= res.resetPasswordTokenExpiry) {
        console.log("token is valid");
        return true;
      } else {
        console.log("token is no longer valid");
      }
    } else {
      console.log("token is not in database");
    }
  } else {
    console.log("token is null or empty");
  }
  return false;
};

const updateUserPasswordByToken = async (
  passwordHash: String,
  token: String
) => {
  return await prisma.user.update({
    where: {
      resetPasswordToken: token,
    },
    data: {
      password: passwordHash,
    },
  });
};

const removeUserResetPasswordToken = async (token: String) => {
  return await prisma.user.update({
    where: {
      resetPasswordToken: token,
    },
    data: {
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    },
  });
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

const getSHA256 = (token: String) => {
  return crypto.createHash("sha256").update(token, "binary").digest("hex");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const fieldsValidation = await validateFields(req.body);
    if (fieldsValidation[0]) {
      const token = getSHA256(req.body.token);
      if (await checkIfTokenIsValid(token)) {
        try {
          const newPasswordHash: String = await hashPassword(
            req.body.newPassword
          );
          await updateUserPasswordByToken(newPasswordHash, token);
          await removeUserResetPasswordToken(token);
          return res.status(204).end();
        } catch (err) {
          console.error(err);
          return res.status(500).end();
        }
      } else {
        return res
          .status(422)
          .json([
            "This link is no longer valid. Please request a new reset password link.",
          ]);
      }
    } else {
      return res
        .status(422)
        .json([
          "This link is no longer valid. Please request a new reset password link.",
        ]);
    }
  }
}
