import express from "express";
import { auth } from "../middlewares/middleware_auth.js";
import { allMessages, sendMessage } from "../Controllers/controller_message.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:chatId", auth, allMessages);

export default router;
