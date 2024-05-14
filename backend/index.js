import express from "express";
import dotenv from "dotenv";
import { chats } from "./Data/data.js";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

dotenv.config();
// ........................................<Routes>............................................ //
import userRoutes from "./Routes/routes_user.js";
import chatRoutes from "./Routes/routes_chat.js";
import messageRoutes from "./Routes/routes_message.js";
import { errorhandler, notFound } from "./middlewares/middleware_error.js";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(express.json()); //to accept json data

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// app.use(notFound);
// app.use(errorhandler);

// ------------------------------------Deployment-----------------------------------------//
const dirname1 = path.resolve();
const pathArray = dirname1.split("\\");
pathArray.pop();
const newDirName = path.join(...pathArray);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(newDirName, "frontend", "build")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(newDirName, "frontend", "build", "index.html"));
	});
} else {
	app.get("/", (req, res) => {
		res.send("API is running successfully...");
	});
}
// -----------------------------------------------------------------------------//

const connection_URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.wjuobw5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
	.connect(connection_URL)
	.then((res) => {
		console.log(`😎 Database is connected `);

		const server = app.listen(PORT, () => {
			console.log(`🎇 Server is running on ${PORT} `);
		});

		const io = new Server(server, {
			pingTimeout: 60000,
			cors: {
				origin: "http://localhost:3000",
			},
		});

		io.on("connection", (socket) => {
			console.log("Connected using socket.io");

			socket.on("setup", (userData) => {
				const val = socket.join(userData._id);
				socket.emit(`connected`);
			});

			socket.on("join chat", (room) => {
				socket.join(room);
			});

			socket.on("typing", (room) => socket.in(room).emit("typing"));
			socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

			socket.on("new message", (newMessageReceived) => {
				let chat = newMessageReceived.chat;
				if (!chat.users) return console.log(`chat users not defined`);

				chat.users.forEach((user) => {
					if (user._id == newMessageReceived._id) return;
					socket.in(user._id).emit("message received", newMessageReceived);
				});
			});

			socket.off("setup", () => {
				console.log("USER DISCONNECTED");
				socket.leave(userData._id);
			});
		});
	})
	.catch((err) => {
		console.log(`Error while connecting`);
		console.log(`One reason may be You are not connected to Internet`);
		console.log(err.message);
	});
