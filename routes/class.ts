import Router from "express-promise-router";
const router = Router();

router.route("/:classId").get();

router.route("/:classId/videos/:videoId").post();
router.route("/:classId/videos/:videoId").delete();

export default router;
