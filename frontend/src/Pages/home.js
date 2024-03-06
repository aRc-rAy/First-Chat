import React, { useEffect } from "react";
import {
	Container,
	Box,
	Text,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authetication/Login";
import SignUp from "../Components/Authetication/SignUp";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		if (userInfo) {
			// navigate("/chat");
			return;
		}
	}, [navigate]);
	return (
		<Container maxWidth="xl" centerContent>
			<Box
				display="flex"
				justifyContent="center"
				p={3}
				bg={"black"}
				color={"white"}
				w={"100%"}
				m={"40px 0 15px 0"}
				borderRadius={"lg"}
			>
				<Text fontSize={"4xl"} fontFamily={"Work sans"} centerContent>
					First-Chat
				</Text>
			</Box>
			<Box w={"100%"}>
				<Tabs
					isFitted
					variant="enclosed"
					background={"black"}
					color={"white"}
					borderRadius={"10px"}
				>
					<TabList>
						<Tab>Login</Tab>
						<Tab>Sign Up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<SignUp />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default Home;
