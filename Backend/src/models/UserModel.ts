import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image: string;
  salt: string;
  color: number;
  profileSetup: boolean;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    image: { type: String },
    color: { type: Number, required: false },
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updateAt;
      },
    },
  }
);

const User = mongoose.model("User", UserSchema);
export default User;