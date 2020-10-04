import { Request, Response, NextFunction } from "express";
import Router from "express-promise-router";
const router = Router();
import { validate, Joi } from "express-validation";
import jwt from "express-jwt";

import UserController from "../controllers/user";
import User from "../models/user";

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return [
    jwt({
      secret: process.env.JWT_SECRET || "",
      algorithms: ["HS256"],
      requestProperty: "token",
    })(req, res, async () => {
      const user = await User.findById(req.token?.sub);
      if (!user) return res.status(401).send(); // User not found
      if (req.params.userId && req.params.userId != user.id)
        return res.status(401).send(); // User's ID doesn't correspond to route ID
      req.user = user;
      return next();
    }),
  ];
};

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

router.route("/:userId").get(authenticated, UserController.get);

router
  .route("/:userId/class/:classId")
  .post(authenticated, UserController.classes.create);
router
  .route("/:userId/class/:classId")
  .delete(authenticated, UserController.classes.delete);

export default router;
