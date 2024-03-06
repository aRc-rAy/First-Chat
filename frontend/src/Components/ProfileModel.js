import React from "react";
import {
	useDisclosure,
	IconButton,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Image,
	Text,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModel = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children} </span>
			) : (
				<IconButton
					display={{ base: "flex" }}
					icon={<ViewIcon />}
					onClick={onOpen}
				></IconButton>
			)}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent h={"350px"}>
					<ModalHeader
						fontSize={"40px"}
						fontFamily={"Work sans"}
						display={"flex"}
						justifyContent={"center"}
					>
						{user.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display={"flex"}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"space-between"}
					>
						<Image
							borderRadius={"full"}
							boxSize={"150px"}
							src={user.pic}
							alt={user.name}
						/>
						<Text
							fontSize={{ base: "28px", md: "30px" }}
							fontFamily={"Work sans"}
							marginBottom={"10px"}
						>
							Email:{user.email}
						</Text>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModel;
