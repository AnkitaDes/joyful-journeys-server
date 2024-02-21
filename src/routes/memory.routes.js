import { Router } from "express";
import {
  createMemory,
  addLike,
  getAllMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
} from "../controllers/memory.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-memory").post(upload.single("image"), createMemory);

router.route("/:id/like").put(verifyJWT, addLike);

router.route("/").get(getAllMemories);

router.route("/:id").get(getMemoryById);

router.route("/:id").put(verifyJWT, upload.single("image"), updateMemory);

router.route("/:id").delete(verifyJWT, deleteMemory);

export default router;
