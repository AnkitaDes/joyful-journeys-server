import { Router } from "express";
import { createMemory, addLike } from "../controllers/memory.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(upload.single("image"), createMemory);

// router.route("/:id/like").put(verifyJWT, addLike);

export default router;
