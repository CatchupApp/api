import mongoose from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export interface UserDocument extends mongoose.Document {
  id: string;
  fullname: string;
  username: string;
  password: string;
  checkPassword: (password: string) => boolean; // Check if the given plaintext password is correct
  teacher: boolean;
  classes: {
    id: string; // Id of the Class
  }[];
  token: () => string; // Return a JWT token
}

const UserSchema = new mongoose.Schema({
  fullname: String,
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

UserSchema.pre("save", async function (this: UserDocument, next) {
  try {
    // Only trigger hashing if the password is different/changed
    if (!this.isModified("password")) {
      next();
    }

    // Don't need to set a salt as a secure one is auto-generated
    const passwordHash = await argon2.hash(this.password);

    // Update the password to use the hashed version
    this.set("password", passwordHash);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.checkPassword = async function (
  this: UserDocument,
  password: string
) {
  try {
    // Check hashed password against plaintext password
    return await argon2.verify(this.password, password);
  } catch (e) {
    throw new Error(e);
  }
};

UserSchema.methods.token = async function (this: UserDocument) {
  const options = {
    iss: "Catchup",
    sub: this.id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3, // 3 hours
  };
  const token = jwt.sign(options, process.env.JWT_SECRET || "");
  return token;
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
