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
      if (req.user && req.user.id == req.params.userId) {
        return res.send({
          fullname: req.user.fullname,
          username: req.user.username,
          classes: req.user.classes,
          teacher: req.user.teacher,
        });
      } else {
        return res.status(401).send();
      }
    } catch (err) {
      next(err);
    }
  },
};
