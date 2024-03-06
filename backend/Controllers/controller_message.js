import asyncHandler from "express-async-handler";
import { Message } from "../Models/model_message_.js";
import { User } from "../Models/model_user_.js";
import { Chat } from "../Models/model_chat_.js";

export const sendMessage = asyncHandler(async (req, res) => {
	const { content, chatId } = req.body;

	if (!content || !chatId) {
		return res.status(400).send("Send all the required things");
	}

	let newMessage = {
		sender: req.user._id,
		content: content,
		chat: chatId,
	};

	try {
		let message = await Message.create(newMessage);

		message = await message.populate("sender", "name pic email");
		message = await message.populate("chat");
		message = await User.populate(message, {
			path: "chat.users",
			select: "name pic email",
		});
		await Chat.findByIdAndUpdate(chatId, {
			latestMessage: message,
		});
		res.status(200);
		return res.json(message);
	} catch (error) {
		res.status(400);
		return res.send({ message: `${error.message}` });
	}
});

export const allMessages = asyncHandler(async (req, res) => {
	const { chatId } = req.params;
	if (!chatId) {
		res.status(400);
		return res.send(`Not a valid chat Id -> ${chatId}`);
	}

	try {
		const messages = await Message.find({ chat: chatId })
			.populate("sender", "name pic email")
			.populate("chat");

		res.status(200);
		return res.json(messages);
	} catch (error) {
		res.status(400);
		return res.json({ message: `${error.message}` });
	}
});
