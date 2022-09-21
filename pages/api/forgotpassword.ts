import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { User } from "../../utils/types";
import * as crypto from "crypto";
import nodemailer from "nodemailer";
import getEmailTemplate from "../../utils/email-template";

const validateEmail = (email: String) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const getUserByEmail = async (email) => {
  console.log("querying database getUserByEmail");
  const user: User = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      resetPasswordToken: true,
      resetPasswordTokenExpiry: true,
    },
  });
  return user;
};

const generateResetPasswordToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

const getSHA256 = (token: String) => {
  return crypto.createHash("sha256").update(token, "binary").digest("hex");
};

const getResetPasswordTokenExpiry = (): BigInt => {
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };
  return new Date().addHours(12).getTime();
};

const updateUserResetTokenByID = async (
  resetPasswordToken: String,
  resetPasswordTokenExpiry: BigInt,
  email: String
) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      resetPasswordToken,
      resetPasswordTokenExpiry,
    },
  });
};

const sendResetPasswordTokenEmail = async (
  email: String,
  resetPasswordToken: String
) => {
  const EMAIL = process.env.EMAIL;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  const APP_URL = process.env.APP_URL;
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
    secure: true,
  });

  const mailData = {
    from: EMAIL,
    to: email,
    subject: `Recover your password`,
    html: getEmailTemplate(
      `${APP_URL}/auth/resetpassword/${resetPasswordToken}`
    ),
  };
  try {
    console.log(await transporter.sendMail(mailData));
  } catch (err) {
    console.log("Email error", err);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const email = req.body.email;
    if (validateEmail(email)) {
      const user: User = await getUserByEmail(email);
      if (user) {
        try {
          const generatedResetPasswordToken = generateResetPasswordToken();
          console.log(
            "generatedResetPasswordToken",
            generatedResetPasswordToken
          );
          console.log(
            "generatedResetPasswordToken length",
            generatedResetPasswordToken.length
          );
          const sha256Token = getSHA256(generatedResetPasswordToken);
          console.log("sha256Token", sha256Token);
          console.log("sha256Token length", sha256Token.length);
          const resetPasswordTokenExpiry: BigInt =
            getResetPasswordTokenExpiry();
          await updateUserResetTokenByID(
            sha256Token,
            resetPasswordTokenExpiry,
            email
          );
          await sendResetPasswordTokenEmail(email, generatedResetPasswordToken);
          return res.status(200).end();
        } catch (err) {
          console.error(err);
          return res.status(500).end();
        }
      } else {
        return res.status(200).end();
      }
    } else {
      return res.status(400).end();
    }
  }
}
