import NextAuth, {
  Awaitable,
  NextAuthOptions,
  RequestInternal,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "../../../lib/bcrypt";
import { prisma } from "../../../lib/prisma";

const checkLoginCredentials = async (
  email: string,
  password: string
): Promise<[boolean, null | User]> => {
  console.log("querying database checkLoginCredentials");
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

const getUserByID = async (id) => {
  console.log("querying database getUserByID");
  const user: User = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      profilePhotoURL: true,
    },
  });
  return user;
};
// @ts-ignore

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
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
        const [isLoggedIn, user]: [isLoggedIn: boolean, user: User] =
          await checkLoginCredentials(credentials.email, credentials.password);
        if (isLoggedIn) {
          return {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            profilePhotoURL: user.profilePhotoURL,
          };
        } 
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      // @ts-ignore

      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore

      session.user = await getUserByID(token.user.id);
      return session;
    },
  },
};

export default NextAuth(authOptions);
