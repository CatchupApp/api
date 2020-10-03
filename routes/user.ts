import Router from "express-promise-router";
const router = Router();

router.route("/").get();
router.route("/").post();

router.route("/:userId").get();

router.route("/:userId/classes/:classId").post();
router.route("/:userId/classes/:classId").delete();

export default router;
