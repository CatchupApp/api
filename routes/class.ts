import Router from "express-promise-router";
const router = Router();
import { validate, Joi } from "express-validation";
import multer from "multer";

import { authenticated } from "../utils/auth";
import ClassController from "../controllers/class";

const upload = multer({
  dest: "upload/",
  // Require .mp4 videos
  fileFilter: (req, file, next) => {
    if (file.mimetype == "video/mp4") next(null, true);
    else next(new Error("Only .mp4 video files are allowed."));
  },
});

router.route("/").post(
  authenticated,
  validate(
    {
      body: Joi.object({
        name: Joi.string().required(),
        period: Joi.string().required(),
      }),
    },
    { keyByField: true }
  ),
  ClassController.create
);

router.route("/:classId").get(authenticated, ClassController.get);

router.route("/:classId/video").post(
  authenticated,
  validate(
    {
      body: Joi.object({
        name: Joi.string().required(),
      }),
    },
    { keyByField: true }
  ),
  upload.single("video"),
  ClassController.video.create
);
router
  .route("/:classId/video/:videoId")
  .get(authenticated, ClassController.video.get);
router
  .route("/:classId/video/:videoId")
  .delete(authenticated, ClassController.video.delete);

export default router;
