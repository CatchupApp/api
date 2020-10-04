import Router from "express-promise-router";
const router = Router();
import { validate, Joi } from "express-validation";
import jwt from "express-jwt";

import { authenticated } from "./user";
import ClassController from "../controllers/class";

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

router.route("/:classId/video/:videoId").post();
router.route("/:classId/video/:videoId").delete();

export default router;
