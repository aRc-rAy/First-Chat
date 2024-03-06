import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/provider_chat";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import * as api from "../API";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../Config/getSender";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState();
	const {
		user,
		setSelectedChat,
		chats,
		setChats,
		notification,
		setNotification,
	} = ChatState();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const logOutHandler = () => {
		localStorage.removeItem("userInfo");
		navigate("/");
	};

	const handleSearch = async () => {
		if (!search) {
			toast({
				title: "Please enter something...",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}

		try {
			setLoading(true);
			const { data } = await api.getUsers(search);
			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			setLoading(false);
			toast({
				title: "Failed to load the search results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
			console.log(`${error.message}`);
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const { data } = await api.createChat(userId);
			if (!chats?.find((c) => c?._id === data._id)) {
				setChats([data, ...chats]);
			}

			setLoadingChat(false);
			setSelectedChat(data);
			onClose();
		} catch (error) {
			setLoadingChat(false);
			toast({
				title: "Error fetching the chat",
				description: `${error.message}`,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	return (
		<>
			<Box
				display={"flex"}
				justifyContent={"space-between"}
				alignItems={"center"}
				background={"white"}
				width={"100%"}
				padding={"5px 10px 5px 10px"}
				borderWidth={"5px"}
			>
				<Tooltip label="Seach users to chat" hasArrow placement="bottom-end">
					<Button variant={"ghost"} onClick={onOpen}>
						<i className="fas fa-search" style={{ marginRight: "14px" }}></i>
						<Text display={{ base: "none", md: "flex" }} padding={"4px"}>
							Seach Users
						</Text>
					</Button>
				</Tooltip>

				<Text fontSize={"2xl"} fontFamily={"Work sans"}>
					First-Chat
				</Text>

				<div>
					<Menu>
						<MenuButton padding={"1"}>
							<NotificationBadge
								count={notification?.length}
								effect={Effect.SCALE}
							/>
							<BellIcon fontSize={"3xl"} padding={"1"} marginRight={"10px"} />
						</MenuButton>
						<MenuList pl={4}>
							{!notification.length && "No new messages"}
							{notification.map((notif) => {
								return (
									<MenuItem
										key={notif._id}
										onClick={() => {
											setSelectedChat(notif.chat);
											setNotification(
												notification.filter((cur) => cur !== notif)
											);
										}}
									>
										{notif.chat.isGroupChat
											? `New message in ${notif.chat.chatName}`
											: `New message from ${getSender(user, notif.chat.users)}`}
									</MenuItem>
								);
							})}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size={"sm"}
								cursor={"pointer"}
								name={user.name}
								src={user?.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModel user={user}>
								<MenuItem>My profile</MenuItem>
							</ProfileModel>
							<MenuItem onClick={logOutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>

					<DrawerBody>
						<Box display={"flex"} pb={2}>
							<Input
								placeholder="Search by name of email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={handleSearch}>Go</Button>
						</Box>

						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => accessChat(user._id)}
								/>
							))
						)}
						{loadingChat && <Spinner ml="auto" display={"flex"} />}
					</DrawerBody>

					<DrawerFooter>
						<Button variant="outline" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="blue">Save</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
