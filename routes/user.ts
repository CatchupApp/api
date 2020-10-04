import Router from "express-promise-router";
const router = Router();
import { validate, Joi } from "express-validation";

import { authenticated } from "../utils/auth";
import UserController from "../controllers/user";

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
