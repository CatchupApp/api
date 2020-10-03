import Router from "express-promise-router";
const router = Router();

router.route("/:videoId").get();

export default router;
