import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import HomePage from "@/pages/HomePage";
import LobbyPage from "@/pages/LobbyPage";
import GamePage from "@/pages/GamePage";

function AppRoutes() {
	useSocketEvents();

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/lobby/:roomCode" element={<LobbyPage />} />
			<Route path="/game/:roomCode" element={<GamePage />} />
		</Routes>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<TooltipProvider>
				<AppRoutes />
			</TooltipProvider>
		</BrowserRouter>
	);
}
