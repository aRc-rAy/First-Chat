import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../Context/provider_chat";
import * as api from "../API";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModel = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupName, setGroupName] = useState("");
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const toast = useToast();

	const { chats, setChats } = ChatState();

	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}

		try {
			setLoading(true);
			const { data } = await api.getUsers(search);
			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error while fetching users...",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: "User already added",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		setSelectedUsers([...selectedUsers, userToAdd]);
	};

	const handleDelete = (userToRemove) => {
		setSelectedUsers(
			selectedUsers.filter((sel) => sel._id !== userToRemove._id)
		);
	};

	const handleSubmit = async () => {
		if (!groupName || !selectedUsers) {
			toast({
				title: "Please fill all the fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			const { data } = await api.createGroup({
				name: groupName,
				users: JSON.stringify(selectedUsers.map((u) => u._id)),
			});
			console.log(data);
			setChats([data, ...chats]);
			onClose();
			toast({
				title: "New group chat created!",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setSelectedUsers([]);
			setSearch("");
			setSearchResult([]);
		} catch (error) {
			toast({
				title: "Can't create group",
				description: `${error.message}`,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
		}
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={"35px"}
						fontFamily={"Work sans"}
						display={"flex"}
						justifyContent={"center"}
					>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
						<FormControl>
							<Input
								placeholder="Chat name"
								mb={3}
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add users eg:Tony Stark, Captain America,Groot"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						<Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
							{selectedUsers?.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									handleFunction={() => handleDelete(u)}
								/>
							))}
						</Box>

						{loading ? (
							<div>
								<Spinner />
							</div>
						) : (
							searchResult
								?.slice(0.4)
								.map((user) => (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => handleGroup(user)}
									/>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" onClick={handleSubmit}>
							Create
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModel;
