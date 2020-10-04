import { Request, Response, NextFunction } from "express";
import { userInfo } from "os";
import Class from "../models/class";

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
      if (req.user) {
        const classes = await Promise.all(
          req.user.classes.map(async (classId) => {
            const theClass = await Class.findById(classId);
            if (theClass) {
              return {
                id: theClass.id,
                name: theClass.name,
                period: theClass.period,
              };
            }
          })
        );
        return res.send({
          fullname: req.user.fullname,
          username: req.user.username,
          classes: classes.filter(Boolean),
          teacher: req.user.teacher,
        });
      } else {
        return res.status(401).send();
      }
    } catch (err) {
      next(err);
    }
  },
  classes: {
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (req.user) {
          const classId = req.params.classId;
          if (
            Class.exists({ _id: classId }) &&
            !req.user.classes.includes(classId)
          ) {
            req.user.classes.push(classId);
            await req.user.save();

            return res.send();
          } else {
            return res.status(400).send();
          }
        } else {
          return res.status(401).send();
        }
      } catch (err) {
        next(err);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (req.user) {
          const classId = req.params.classId;
          req.user.classes = req.user.classes.filter((id) => id != classId);
          await req.user.save();

          return res.send();
        } else {
          return res.status(401).send();
        }
      } catch (err) {
        next(err);
      }
    },
  },
};
