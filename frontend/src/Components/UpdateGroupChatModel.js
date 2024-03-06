import { ViewIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	FormControl,
	IconButton,
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
import UserBadgeItem from "./UserBadgeItem";
import * as api from "../API";
import UserListItem from "./UserListItem";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupName, setGroupName] = useState("");
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);
	const { selectedChat, setSelectedChat, user } = ChatState();
	const toast = useToast();

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
	const handleRename = async () => {
		if (!groupName) {
			return;
		}

		try {
			setRenameLoading(true);
			const { data } = await api.renameGroup({
				chatId: selectedChat._id,
				chatName: groupName,
			});

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch (error) {
			setRenameLoading(false);
			toast({
				title: "Error while renaming..",
				description: `${error.message}`,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
		}
	};

	const handleGroup = async (userToAdd) => {
		if (selectedChat.users.includes(userToAdd)) {
			toast({
				title: "User already in group",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: "Only admin can add members!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});

			return;
		}

		try {
			setLoading(true);
			const { data } = await api.addMember({
				chatId: selectedChat._id,
				userId: userToAdd._id,
			});

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			setLoading(false);

			toast({
				title: "Error while adding user...!",
				status: "error",
				description: `${error.message}`,
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	const handleDelete = async (userToRemove) => {
		if (
			selectedChat.groupAdmin._id !== user._id &&
			userToRemove._id !== user._id
		) {
			toast({
				title: "Only admin can remove members!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});

			return;
		}

		try {
			setLoading(true);
			const { data } = await api.removeMember({
				chatId: selectedChat._id,
				userId: userToRemove._id,
			});

			userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			fetchMessages();
			setLoading(false);
		} catch (error) {
			setLoading(false);

			toast({
				title: "Error while removing user...!",
				status: "error",
				description: `${error.message}`,
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	return (
		<>
			<IconButton
				display={{ base: "flex" }}
				icon={<ViewIcon />}
				onClick={onOpen}
			/>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={"35px"}
						display={"flex"}
						justifyContent={"center"}
					>
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
							{selectedChat.users?.map((u) => {
								return (
									<UserBadgeItem
										key={u._id}
										user={u}
										handleFunction={() => handleDelete(u)}
									/>
								);
							})}
						</Box>
						<FormControl display={"flex"}>
							<Input
								placeholder="Chat name"
								mb={3}
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
							/>
							<Button
								variant={"solid"}
								colorScheme="teal"
								ml={1}
								isLoading={renameLoading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add users eg:Tony Stark, Captain America,Groot"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
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
						<Button colorScheme="red" onClick={() => handleDelete(user)}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModel;
