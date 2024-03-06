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
import * as api from "../../API";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setloading] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();

	const handleClick = (prev) => {
		setShow(1 - show);
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		setloading(true);
		if (!email || !password) {
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

		try {
			const { data } = await api.login({ email, password });
			toast({
				title: "Login successfull",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			navigate("/chat");
		} catch (error) {
			toast({
				title: "Error occured while login!",
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

			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={loading}
			>
				Login
			</Button>
		</VStack>
	);
};

export default SignUp;
