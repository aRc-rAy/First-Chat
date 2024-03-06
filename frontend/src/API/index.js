import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:4004",
});

API.interceptors.request.use(
	(config) => {
		const user = JSON.parse(localStorage.getItem("userInfo"));
		config.headers["Content-Type"] = "application/json";
		if (user) {
			config.headers.Authorization = `Bearer ${user.token}`;
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

export const getUsers = (search) => API.get(`/api/user?search=${search}`);
export const singup = (data) => API.post("/api/user/signup", data);
export const login = (data) => API.post("/api/user/login", data);

export const createChat = (userId) => API.post("/api/chat", { userId });
export const getChat = () => API.get("/api/chat");
export const createGroup = (data) => API.post("/api/chat/group", data);
export const renameGroup = (data) => API.put("/api/chat/rename", data);
export const addMember = (data) => API.put("/api/chat/groupadd", data);
export const removeMember = (data) => API.put("/api/chat/groupremove", data);

export const sendMessage = (data) => API.post("/api/message", data);
export const getAllMessages = (id) => API.get(`/api/message/${id}`);
