import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import { connectDB } from "@/lib/connectDB";

connectDB();

const UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  },
  {
    // 時間戳
    timestamps: true,
  }
)

UserSchema.pre('save',async function(next){
  const hashPassword = await bcrypt.hash(this.password, 10)
  this.password = hashPassword
  next()
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User;