import express from "express";
import { allUsers, login, signup } from "../Controllers/controller_user.js";
import { auth } from "../middlewares/middleware_auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/", auth, allUsers);

export default router;
