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
    image: {
      type: mongoose.Schema.Types.Mixed,
    },
    imgData: {
      type: mongoose.Schema.Types.Mixed,
    },
    collections: {
      type: "array",
      required: true
    },
    provider: {
      type: String,
      required: true
    }
  },
  {
    // 時間戳
    timestamps: true,
  }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User;