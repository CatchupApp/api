import Router from "express-promise-router";
const router = Router();
import { validate, Joi } from "express-validation";
import jwt from "express-jwt";

import UserController from "../controllers/user";

const authenticated = () =>
  jwt({ secret: process.env.JWT_SECRET || "", algorithms: ["HS256"] });

router.route("/").post(
  validate(
    {
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        fullname: Joi.string(),
        teacher: Joi.boolean(),
      }),
    },
    { keyByField: true }
  ),
  UserController.create
);

router.route("/:userId").get(authenticated(), UserController.get);

router.route("/:userId/classes/:classId").post();
router.route("/:userId/classes/:classId").delete();

export default router;
