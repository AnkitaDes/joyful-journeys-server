import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

// router.route("/:id/like").put(verifyJWT, addLike);

export default router;