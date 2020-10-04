import { Request, Response, NextFunction } from "express";

import { uploadFile } from "../utils/storage";
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
  video: {
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
          // TODO: Upload to Google Cloud first, then save to DB

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
    get: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const theClassId = req.params.classId;
        const theClass = await Class.findById(theClassId);
        const videoId = req.params.videoId;
        if (
          req.user &&
          theClass &&
          req.user.classes.includes(theClass.id) &&
          videoId &&
          theClass.videos.includes(videoId)
        ) {
          const video = await Video.findById(videoId);
          // TODO: Here's where all the analysis will be sent
          if (video) {
            return res.send({
              id: video.id,
              source: video.source,
            });
          }
        }
        return res.status(404).send();
      } catch (err) {
        next(err);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const theClassId = req.params.classId;
        const theClass = await Class.findById(theClassId);
        const videoId = req.params.videoId;
        if (
          req.user &&
          req.user.teacher &&
          theClass &&
          req.user.classes.includes(theClass.id) &&
          videoId &&
          theClass.videos.includes(videoId)
        ) {
          // TODO: Remove the file from Google Cloud as well
          await Video.findByIdAndDelete(videoId);
          return res.send();
        }
        return res.status(404).send();
      } catch (err) {
        next(err);
      }
    },
  },
};
