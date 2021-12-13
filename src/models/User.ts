import { model, Schema } from "mongoose";

interface IUser {
  email: string;
  password: string;
  name: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = model<IUser>("User", userSchema);

export { UserModel, IUser };
