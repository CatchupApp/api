import { Request, Response, NextFunction } from "express";

import User, { UserDocument } from "../models/user";

/**
 *
 * @param user The user to create the JWT for
 */

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if there is an existing user
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser)
        return res.status(409).send({ message: "Username is taken." });

      // Create and save the new user
      const newUser = new User({
        ...req.body,
        teacher: req.body.teacher || false, // Users are not teachers by default
      });
      await newUser.save();

      // Create the JWT and return it
      return res.send({ token: await newUser.token() });
    } catch (err) {
      return next(err);
    }
  },
};
