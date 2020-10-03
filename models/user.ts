import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  id: string;
  name: string;
  username: string;
  password: string;
  teacher: boolean;
  classes: {
    id: string; // Id of the Class
  }[];
}

const UserSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true, // The only identifier for a User other than Id
  },
  password: {
    type: String,
    required: true,
  },
  teacher: {
    type: Boolean,
    default: false,
    required: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
