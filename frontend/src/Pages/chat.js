import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/provider_chat";
import SideDrawer from "../Components/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useState } from "react";

const Chat = () => {
	const { user } = ChatState();
	const [fetchAgain, setFetchAgain] = useState(false);

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer />}
			<Box
				display={"flex"}
				justifyContent={"space-between"}
				padding={"10px"}
				width={"100%"}
				height={"90vh"}
			>
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && (
					<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</Box>
		</div>
	);
};

export default Chat;
