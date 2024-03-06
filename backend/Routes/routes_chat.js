import express from "express";
import { auth } from "../middlewares/middleware_auth.js";
import {
	accessChat,
	createGroupChat,
	fetchChats,
	renameGroup,
	removeFromGroup,
	addToGroup,
} from "../Controllers/controller_chat.js";

const router = express.Router();

router.get("/", auth, fetchChats);
router.post("/", auth, accessChat);
router.post("/group", auth, createGroupChat);
router.put("/rename", auth, renameGroup);
router.put("/groupremove", auth, removeFromGroup);
router.put("/groupadd", auth, addToGroup);

export default router;
