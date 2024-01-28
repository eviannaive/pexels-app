import Local from 'passport-local'
import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const localStrategy = new Local.localStrategy(async function(email,
  password,
  done){
    try{
      const findUser = await User.findOne({email});
      if(findUser) {
        const validatePassword = await bcrypt.compare(password, findUser.password);
        if(validatePassword){
          const token = jwt.sign(tokenObject, process.env.NEXT_PUBLIC_SECRET);
        }
          return done(null, token)
      }
    }catch(error){

      return done(error)
    }

})