import { Request, Response, NextFunction } from "express";

import User, { UserDocument } from "../models/user";
import Class, { ClassDocument } from "../models/class";

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (user?.teacher != true)
        return res.send(403).send({ message: "You must be a teacher." });

      const newClass = new Class({
        ...req.body,
      });
      await newClass.save();

      user.classes.push(newClass.id);
      await user.save();

      return res.send({ id: newClass.id });
    } catch (err) {
      return next(err);
    }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const theClassId = req.params.classId;
      const theClass = await Class.findById(theClassId);
      if (req.user && theClass && req.user.classes.includes(theClass.id)) {
        return res.send({
          name: theClass.name,
          period: theClass.period,
        });
      } else {
        return res.status(404).send();
      }
    } catch (err) {
      next(err);
    }
  },
};
