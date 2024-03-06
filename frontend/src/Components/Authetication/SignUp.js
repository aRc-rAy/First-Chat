import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
	useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import * as api from "../../API/index.js";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
	const [show, setShow] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [pic, setPic] = useState("");
	const [loading, setloading] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();

	const handleClick = (prev) => {
		setShow(1 - show);
	};

	const postDetails = (pics) => {
		console.log(pics);

		setloading(true);
		if (!pics) {
			toast({
				title: "Please select an image",
				description: "Add image",
				status: "warning",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		if (
			pics.type === "image/jpg" ||
			pics.type === "image/jpeg" ||
			pics.type === "image/png"
		) {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "first-chat");
			data.append("cloud_name", "dgomadqhf");

			fetch("https://api.cloudinary.com/v1_1/dgomadqhf/image/upload", {
				method: "POST",
				body: data,
			})
				.then((res) => res.json())
				.then((res) => {
					setPic(res.url.toString());
					setloading(false);
					console.log(res);
					toast({
						title: "Image uploaded successfully",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
				})
				.catch((err) => {
					setloading(false);
					console.log(`Error :${err}`);
				});
		} else {
			toast({
				title: "Wrong image type",
				description: "Add again",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			setloading(false);
			console.log("Wrong image type");
		}
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		setloading(true);
		if (!name || !email || !password || !confirmPassword) {
			toast({
				title: "Please fill the required options",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setloading(false);
			return;
		}
		if (password !== confirmPassword) {
			toast({
				title: "Password do not match",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setloading(false);
			return;
		}

		try {
			const { data } = await api.singup({ name, email, password, pic });
			toast({
				title: "Registration successfull",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			navigate("/chat");
			console.log(data);
		} catch (error) {
			toast({
				title: "Error occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			console.log(error);
		}
		setloading(false);
	};

	return (
		<VStack>
			<FormControl id="first-name" isRequired>
				<FormLabel>Name :</FormLabel>
				<Input
					borderColor={"gray"}
					placeholder="Enter your name"
					onChange={(e) => setName(e.target.value)}
					value={name}
				/>
			</FormControl>
			<FormControl id="email" isRequired>
				<FormLabel>Email :</FormLabel>
				<Input
					borderColor={"gray"}
					value={email}
					placeholder="Enter your email"
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password :</FormLabel>
				<InputGroup size={"md"}>
					<Input
						borderColor={"gray"}
						type={show ? "text" : "password"}
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement width={"4.5rem"}>
						<Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="password-C" isRequired>
				<FormLabel>Confirm Password :</FormLabel>
				<InputGroup size={"md"}>
					<Input
						borderColor={"gray"}
						type={show ? "text" : "password"}
						placeholder="confirm password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<InputRightElement width={"4.5rem"}>
						<Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>

			<FormControl id="picture">
				<FormLabel>Upload profile picture:</FormLabel>
				<Input
					type="file"
					p="1.5"
					accept="image/"
					onChange={(e) => postDetails(e.target.files[0])}
				/>
			</FormControl>

			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={loading}
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export default SignUp;
