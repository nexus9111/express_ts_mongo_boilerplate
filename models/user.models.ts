import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../interfaces/user.interface";

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  ROOT: "root",
};

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
    index: true,
  },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    default: ROLES.USER,
    enum: [ROLES.USER, ROLES.ADMIN, ROLES.ROOT],
  },
});

export default mongoose.model<IUser>("User", UserSchema);
