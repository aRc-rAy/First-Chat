import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/provider_chat";
import {
	Box,
	Button,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import {
	ArrowBackIcon,
	ArrowRightIcon,
	ChatIcon,
	ChevronRightIcon,
} from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../Config/getSender";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import * as api from "../API";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../Animations/typing_2.json";

const ENDPOINT = "http://localhost:4004";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const { user, selectedChat, setSelectedChat, notification, setNotification } =
		ChatState();
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const toast = useToast();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRaio: "xMidYMid slice",
		},
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => {
			setSocketConnected(true);
		});

		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
	}, []);

	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		if (!socketConnected) {
			toast({
				title: "Socket is not connected...",
				description: "Please connect to socket.",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top-right",
			});
			return;
		}

		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}

		let lastTypingTime = new Date().getTime();
		let timerLength = 3000;

		setTimeout(() => {
			let timeNow = new Date().getTime();

			let timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength && typing) {
				socket.emit("stop typing", selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
	};

	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			setLoading(true);
			const { data } = await api.getAllMessages(selectedChat._id);

			setMessages(data);
			setLoading(false);

			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			setLoading(false);
			toast({
				title: "Error while fetching messages",
				duration: 5000,
				description: `${error.message}`,
				status: "error",
				isClosable: true,
				position: "top-right",
			});
		}
	};

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	useEffect(() => {
		socket.on("message received", (newMessageReceived) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageReceived.chat._id
			) {
				if (!notification.includes(newMessageReceived)) {
					setNotification([newMessageReceived, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessageReceived]);
			}
		});
	});

	const sendMessage = async (e) => {
		if (e.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				setNewMessage("");
				const { data } = await api.sendMessage({
					content: newMessage,
					chatId: selectedChat._id,
				});
				setMessages([...messages, data]);
				socket.emit("new message", data);
			} catch (error) {
				toast({
					title: "Error while sending messages",
					duration: 5000,
					description: `${error.message}`,
					status: "error",
					isClosable: true,
					position: "top-right",
				});
			}
		}
	};
	const handleSend = async () => {
		if (newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				setNewMessage("");
				const { data } = await api.sendMessage({
					content: newMessage,
					chatId: selectedChat._id,
				});
				setMessages([...messages, data]);
				socket.emit("new message", data);
			} catch (error) {
				toast({
					title: "Error while sending messages",
					duration: 5000,
					description: `${error.message}`,
					status: "error",
					isClosable: true,
					position: "top-right",
				});
			}
		}
	};

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w={"100%"}
						fontFamily={"Work sans"}
						display={"flex"}
						alignItems={"center"}
						justifyContent={{ base: "space-between" }}
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>

						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModel user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModel
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>
							</>
						)}
					</Text>

					<Box
						display={"flex"}
						flexDir={"column"}
						justifyContent={"flex-end"}
						p={3}
						bg={"#E8E8E8"}
						w={"100%"}
						h={"100%"}
						borderRadius={"lg"}
						overflowY={"hidden"}
					>
						{loading ? (
							<Spinner
								size={"xl"}
								w={20}
								h={20}
								alignSelf={"center"}
								margin={"auto"}
							/>
						) : (
							<div className="messages">
								<ScrollableChat messages={messages} />
							</div>
						)}

						<FormControl isRequired mt={3} onKeyDown={sendMessage}>
							{isTyping ? (
								<div style={{ fontFamily: "Work sans", color: "red" }}>
									<Lottie
										options={defaultOptions}
										height={20}
										width={70}
										style={{ marginBottom: 15, marginLeft: 0 }}
									/>
								</div>
							) : (
								<></>
							)}
							<Box
								display={"flex"}
								flexDir={"row"}
								justifyContent={"space-evenly"}
							>
								<Input
									variant={"filled"}
									bg={"#E8E8E2"}
									placeholder="Enter a message..then press enter to send"
									onChange={typingHandler}
									value={newMessage}
									border={"1px solid gray"}
									width={"85%"}
								/>
								<Button
									width={"fitContent"}
									colorScheme="teal"
									onClick={handleSend}
								>
									<IconButton
										display={{ base: "flex", md: "flex" }}
										icon={<ArrowRightIcon />}
										fontSize={"sm"}
										colorScheme="teal"
										onClick={handleSend}
									/>
								</Button>
							</Box>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display={"flex"}
					alignItems={"center"}
					justifyContent={"center"}
					height={"100%"}
				>
					<Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
						Click on a user to start chatting...
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
