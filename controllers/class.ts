import { Request, Response, NextFunction } from "express";

import { uploadFile } from "../utils/storage";
import User, { UserDocument } from "../models/user";
import Class, { ClassDocument } from "../models/class";
import Video, { VideoDocument } from "../models/video";

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
  upload: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const theClassId = req.params.classId;
      const theClass = await Class.findById(theClassId);
      if (
        req.user &&
        req.user.teacher &&
        theClass &&
        req.user.classes.includes(theClass.id) &&
        req.file != null
      ) {
        // TODO: Upload to Google Cloud first, then save

        // Save the video to DB
        const newVideo = new Video({
          source: req.file.filename,
        });
        await newVideo.save();

        return res.send({ id: newVideo.id });
      } else {
        return res.status(404).send();
      }
    } catch (err) {
      next(err);
    }
  },
};
