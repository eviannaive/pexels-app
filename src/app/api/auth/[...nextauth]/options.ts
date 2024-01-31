import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/models/User'
import bcrypt from 'bcrypt'
import { connectDB } from "@/lib/connectDB";
import { NextAuthOptions } from 'next-auth'

const GOOGLE_ID = process.env.GOOGLE_ID!
const GOOGLE_SECRET = process.env.GOOGLE_SECRET!
const GITHUB_ID = process.env.GITHUB_ID!
const GITHUB_SECRET = process.env.GITHUB_SECRET!

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
          console.log("Credentials");
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
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET
    }),
  ],
  callbacks: {
    async signIn({ account, profile }){
      console.log('signin~~~~~~~~~~~~',account)
      if(account?.type === 'oauth'){
        console.log('12334565645646', profile.email)
        try{
            await connectDB();
            const {name, email, picture} = profile;
            console.log('runing.........',name, email, picture)
            const foundUser = await User.findOne({email: email}).lean().exec();
            console.log(foundUser)
            if(foundUser){
              console.log('this is true')
            }else{
              console.log('this is false')
              const saveData = await User.create({
                name: name,
                email: email,
                picture: picture,
                provider: account.provider
              });
            }
              return true
          }catch(e){
            console.log(e)
          }
        }
        console.log('loginnnnnnn')
      return true
    },
    async jwt({token, user, session}){
      console.log("jwt callback",user)
      // if(user) token = user
      return token;
    },
    async session({session, token, user}){
      console.log("session callback",user)
      // if(session?.user) session.user = token
      return session;
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
