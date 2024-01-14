import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";
import { db } from "@/server/db/db";
import { Adapter } from "next-auth/adapters";
import { users } from "./db/schema/user";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT,
      clientSecret: env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = await db.query.users.findFirst({
        where: eq(users.id, user ? user.id : token.id),
      });
      if (!dbUserResult) {
        token.id = user.id;
        return token;
      }

      return {
        id: dbUserResult.id,
        name: dbUserResult.name,
        email: dbUserResult.email,
        picture: dbUserResult.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect() {
      return "/home";
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
