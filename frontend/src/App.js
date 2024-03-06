// import { Button } from "@chakra-ui/react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/home";
import Chat from "./Pages/chat";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/chat" element={<Chat />} />
			</Routes>
		</div>
	);
}

export default App;
