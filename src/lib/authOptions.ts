import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/connectDB";
import { AuthOptions } from "next-auth";
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";
import { Collection } from "../../types";
import { DefaultSession } from "next-auth";
import { TypeUser } from "../../types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    error?: any;
    user?: {
      _id: ObjectId;
      provider: string;
      collections: Collection[];
    } & DefaultSession["user"];
  }
}

const GOOGLE_ID = process.env.GOOGLE_ID!;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET!;
const GITHUB_ID = process.env.GITHUB_ID!;
const GITHUB_SECRET = process.env.GITHUB_SECRET!;
const FACEBOOK_ID = process.env.FACEBOOK_ID!;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET!;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "email",
          placeholder: "your email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "your password",
        },
      },
      async authorize(credentials) {
        try {
          await connectDB();
          const foundUser = await User.findOne({ email: credentials?.email });
          if (foundUser) {
            console.log("User Exists");
            const match = await bcrypt.compare(
              credentials?.password as string,
              foundUser.password,
            );
            if (match) {
              console.log("Good Pass");
              return foundUser;
            }
          }
          return null;
        } catch (error) {
          console.log(error);
          return error;
        }
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
    FacebookProvider({
      clientId: FACEBOOK_ID,
      clientSecret: FACEBOOK_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("callback");
      if (account?.type === "oauth") {
        const provider = account.provider;
        try {
          await connectDB();
          const { name, email, image, picture }: any = profile;
          const foundUser = await User.findOne({
            email: email,
            provider: provider,
          })
            .lean()
            .exec();
          if (!foundUser) {
            const saveData = await User.create({
              name: name,
              email: email,
              image: user.image || image || picture,
              collections: [{ groupId: nanoid(), name: "like", photos: [] }],
              provider: provider,
            });
            if (!user.image) user.image = image || picture;
          }
          return true;
        } catch (e) {
          console.log(e);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token, user }) {
      try {
        if (session?.user) {
          await connectDB();
          const userData: TypeUser | undefined = await User.findOne({
            email: session.user.email,
            provider: token.provider,
          }).exec();
          if (userData) {
            session.user._id = userData?._id;
            session.user.provider = userData?.provider;
            session.user.collections = userData?.collections;
          } else {
            session.error = "user not find";
          }
        }
        return session;
      } catch (error) {
        console.warn("next-auth error:", error);
        session.error = error;
        return session;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: '/login'
  // }
};
