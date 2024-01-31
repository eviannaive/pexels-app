import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

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
    },
    picture: {
      type: String,
    },
    provider: {
      type: String,
    }
  },
  {
    // 時間戳
    timestamps: true,
  }
)

UserSchema.pre('save',async function(next){
  if(!this.provider){
    const hashPassword = await bcrypt.hash(this.password, 10)
    this.password = hashPassword
  }
  next()
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User;