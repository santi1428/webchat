import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "../../../lib/bcrypt";
import { prisma } from "../../../lib/prisma";
import { User } from "../../../utils/types";

const checkLoginCredentials = async (
  email: string,
  password: string
): Promise<[boolean, null | User]> => {
  const user: User = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return [false, null];
  }
  const isPasswordCorrect = await comparePassword(password, user.password);
  if (isPasswordCorrect) {
    return [true, user];
  } else {
    return [false, null];
  }
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
        const [isLoggedIn, user] = await checkLoginCredentials(
          credentials.email,
          credentials.password
        );
        if (isLoggedIn) {
          return {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            profilePhotoName: user.profilePhotoName
          };
        } else {
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // session.accessToken = token.accessToken
      // session.name = user.name
      // return session
      session.user = token.user;
      console.log("token", token);
      console.log("session", session);
      return session;
    },
  },
};

export default NextAuth(authOptions);
