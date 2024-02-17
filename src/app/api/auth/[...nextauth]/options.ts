import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from "next-auth/providers/facebook";
import User from '@/models/User'
import bcrypt from 'bcrypt'
import { connectDB } from "@/lib/connectDB";
import { NextAuthOptions } from 'next-auth'

const GOOGLE_ID = process.env.GOOGLE_ID!
const GOOGLE_SECRET = process.env.GOOGLE_SECRET!
const GITHUB_ID = process.env.GITHUB_ID!
const GITHUB_SECRET = process.env.GITHUB_SECRET!
const FACEBOOK_ID = process.env.FACEBOOK_ID!
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET!

export const options : NextAuthOptions = {
  providers:  [
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
        }
      },
      async authorize(credentials){
        try {
          await connectDB();
          console.log("Credentials",credentials);
          const foundUser = await User.findOne({email: credentials.email}).lean().exec();
          if(foundUser) {
            console.log("User Exists");
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            )
            if(match){
              console.log("Good Pass");
              delete foundUser.password;
              return foundUser
            }
          }
          return null

        }catch(error){
          console.log(error)
        }
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET
    }),
    FacebookProvider({
      clientId: FACEBOOK_ID,
      clientSecret: FACEBOOK_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }){
      if(account?.type === 'oauth'){
        const provider = account.provider;
        try{
            await connectDB();
            const {name, email, image, picture} = profile;
            const foundUser = await User.findOne({email: email, provider: provider}).lean().exec();
            if(!foundUser){
              console.log('this is false')
              const saveData = await User.create({
                name: name,
                email: email,
                image: user.image || image || picture,
                collections: [{name: 'like'}],
                provider: provider
              });
              if(!user.image) user.image = image || picture;
            }
            return true
          }catch(e){
            console.log(e)
          }
        }
      return true
    },
    async jwt({token, user, account}){
      console.log("jwt callback",user)
      if(user) {
        token.provider = account?.provider;
      }
      return token;
    },
    async session({session, token, user}){
      if(session?.user){
        const userData = await User.findOne({email: session.user.email, provider: token.provider}).lean().exec();
        session.user._id= userData?._id;
        session.user.provider = userData?.provider;
        session.user.collections = userData?.collections;
        console.log("session callback",session)
        return session;
      } 
    },
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: '/login'
  // }
}
