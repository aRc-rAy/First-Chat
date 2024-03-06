import asyncHandler from "express-async-handler";
import { User } from "../Models/model_user_.js";
import tokenGenerator from "../Utils/tokenGenerator.js";
import bcrypt from "bcryptjs";

export const signup = asyncHandler(async (req, res) => {
	let { name, email, password, pic } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error("Please enter all the feilds");
	}
	if (pic === "") pic = undefined;

	const userExits = await User.findOne({ email });

	if (userExits) {
		res.status(400);
		throw new Error("User already exists with this email.");
	}

	const user = await User.create({ name, email, password, pic });

	if (user) {
		return res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			pic: user.pic,
			token: tokenGenerator({
				_id: user._id,
				name: user.name,
				email: user.email,
			}),
		});
	} else {
		res.status(400);
		throw new Error("Failed to create user");
		return res;
	}
});

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error("Please enter all the feilds");
	}

	const user = await User.findOne({ email });

	if (!user) {
		res.status(400);
		throw new Error("User does not exist.");
	}

	const data = await user.matchPassword(password);

	if (data == false) {
		return res.status(400).json({ message: "Wrong password" });
	}

	if (user) {
		return res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			pic: user.pic,
			token: tokenGenerator({
				_id: user._id,
				name: user.name,
				email: user.email,
			}),
		});
	} else {
		res.status(400);
		throw new Error("Failed to create user");
	}
});

export const allUsers = asyncHandler(async (req, res) => {
	console.log(`Req.query.search:-> ${req.query.search}`);
	const keyword = req.query.search
		? {
				$or: [
					{
						name: { $regex: `${req.query.search}`, $options: "i" },
					},
					{
						email: { $regex: `${req.query.search}`, $options: "i" },
					},
				],
		  }
		: {};

	const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
	res.send(users);
});
