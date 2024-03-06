import asyncHandler from "express-async-handler";
import { Chat } from "../Models/model_chat_.js";
import { User } from "../Models/model_user_.js";

export const accessChat = asyncHandler(async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		return res.status(400).json({ message: "UserId not sent" });
	}

	let isChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },
			{ users: { $elemMatch: { $eq: userId } } },
		],
	})
		.populate("users", "-password")
		.populate("latestMessage");

	isChat = await User.populate(isChat, {
		path: "latestMessage.sender",
		select: "name pic email",
	});

	if (isChat.length > 0) {
		return res.status(200).send(isChat[0]);
	} else {
		let chatData = {
			chatName: "sender",
			isGroupChat: false,
			users: [req.user._id, userId],
		};

		try {
			const createdChat = await Chat.create(chatData);
			const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
				"users",
				"-password"
			);

			return res.status(200).send(FullChat);
		} catch (error) {
			res.status(400);
			console.log(`Error at acessChat : ${error.message}`);
			return res.send(`Error : ${error.message}`);
		}
	}
});

export const fetchChats = asyncHandler(async (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMessage")
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: "latestMessage.sender",
					select: "name pic email",
				});

				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400).send(`Error :${error.message}`);
	}
});

export const createGroupChat = asyncHandler(async (req, res) => {
	let { name, users } = req.body;

	if (!name || !users) {
		return res
			.status(400)
			.json({ message: "Please fill the required details" });
	}

	users = await JSON.parse(users);
	console.log(users);
	users.push(req.user._id);
	console.log(users);

	try {
		const createGroup = await Chat.create({
			users: users,
			groupAdmin: req.user,
			isGroupChat: true,
			chatName: name,
		});

		const FullGroupChat = await Chat.findOne({ _id: createGroup._id })
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		if (!FullGroupChat) {
			throw new Error(`Error while creating the group`);
		} else {
			return res.status(200).send(FullGroupChat);
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: `${error.message}` });
	}
});

export const renameGroup = asyncHandler(async (req, res) => {
	const { chatId, chatName } = req.body;

	if (!chatId || !chatName) {
		return res
			.status(400)
			.json({ message: "Please provide chatId and chatName" });
	}

	try {
		const updatedChat = await Chat.findByIdAndUpdate(
			chatId,
			{ chatName },
			{ new: true }
		)
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		if (!updatedChat) {
			throw new Error(`Error while renaming the group`);
		} else {
			return res.status(200).send(updatedChat);
		}
	} catch (error) {
		return res.status(400).json({ messag: `${error.message}` });
	}
});

export const removeFromGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	if (!chatId || !userId) {
		return res
			.status(400)
			.json({ message: "Please provide all the required fields" });
	}

	try {
		const updatedChat = await Chat.findByIdAndUpdate(
			chatId,
			{
				$pull: { users: userId },
			},
			{
				new: true,
			}
		)
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		if (!updatedChat) {
			throw new Error(`Error while adding user to group`);
		} else {
			return res.status(200).send(updatedChat);
		}
	} catch (error) {
		return res.status(200).json({ message: `${error.message}` });
	}
});

export const addToGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	if (!chatId || !userId) {
		return res
			.status(400)
			.json({ message: "Please provide all the required fields" });
	}

	try {
		const updatedChat = await Chat.findByIdAndUpdate(
			chatId,
			{
				$push: { users: userId },
			},
			{
				new: true,
			}
		)
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		if (!updatedChat) {
			throw new Error(`Error while adding user to group`);
		} else {
			return res.status(200).send(updatedChat);
		}
	} catch (error) {
		return res.status(200).json({ message: `${error.message}` });
	}
});
