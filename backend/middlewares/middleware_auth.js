import jwt, { decode } from "jsonwebtoken";
import { User } from "../Models/model_user_.js";
import ayncHandler from "express-async-handler";

export const auth = ayncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];

			// decode token id
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded._id).select("-password");
			next();
		} catch (error) {
			console.log(`Error at auth middleware`);
			return res.status(400);
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not atuthorized , no token");
	}
});
