import { Request, Response, NextFunction } from "express";
import Router from "express-promise-router";
const router = Router();
import { validate, Joi } from "express-validation";

import User from "../models/user";

router.route("/").post(
  validate(
    {
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
    { keyByField: true }
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username });
      // Check that a user with the username exists
      if (existingUser == null)
        return res.status(404).send({ message: "Username not found." });
      // Check that the password is correct
      if (!(await existingUser.checkPassword(req.body.password)))
        return res.status(400).send({ message: "Invalid credentials." });
      // Create the JWT and return it
      return res.send({
        token: await existingUser.token(),
        id: existingUser.id,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
