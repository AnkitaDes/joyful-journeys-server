import { Router } from "express";
import {
  createMemory,
  addLike,
  getAllMemories,
  getMemoryById,
  getAllUserMemories,
  getAllOtherMemories,
  updateMemory,
  deleteMemory,
} from "../controllers/memory.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-memory").post(upload.single("image"), createMemory);

router.route("/:id/like").put(addLike);

router.route("/").get(getAllMemories);

router.route("/:id").get(getMemoryById);

router.route("/user/:users_id").get(getAllUserMemories);

router.route("/other/:users_id").get(getAllOtherMemories);

router.route("/:id").put(upload.single("image"), updateMemory);

router.route("/:id").delete(deleteMemory);

export default router;
