import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/models/User'
import bcrypt from 'bcrypt'

export const options = {
  providers:  [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
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

        }catch(error){
          console.log(error)

        }
      },
      pages: {
        signIn: '/login',
      }
    }),
    GithubProvider({
      profile(profile){
        console.log('profile github',profile);
        let userRole = 'github user'
        if(profile?.email == 'test@gmail.com'){
          userRole = 'admin'
        }

        return {
          ...profile,
          role: userRole,
        }
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      profile(profile){
        console.log('profile Google',profile);

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        }
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
}
