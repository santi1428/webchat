import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "../../../lib/bcrypt";
import { prisma } from "../../../lib/prisma";
import { User } from "../../../utils/types";

const checkLoginCredentials = async (email: string, password: string) : Promise<boolean> => {
  const user: User = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return false;
  }
  return await comparePassword(password, user.password);
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email.",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password.",
        },
      },
      type: "credentials",
      async authorize(credentials, req) {
        const isLoggedIn = await checkLoginCredentials(credentials.email, credentials.password);
        if (isLoggedIn){
          return {
            email: credentials.email,

          }
        }else{
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
