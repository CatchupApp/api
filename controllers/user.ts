import { Request, Response, NextFunction } from "express";

import User, { UserDocument } from "../models/user";

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
      return res.send({ token: await newUser.token(), id: newUser.id });
    } catch (err) {
      return next(err);
    }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?.sub);
      if (!user) return res.status(401).send();
      return res.send({
        fullname: user.fullname,
        username: user.username,
        classes: user.classes,
      });
    } catch (err) {
      next(err);
    }
  },
};
