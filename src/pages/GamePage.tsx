import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/stores/gameStore";
import TopBar from "@/components/game/TopBar";
import PlayerList from "@/components/game/PlayerList";
import DrawingCanvas from "@/components/game/DrawingCanvas";
import ToolBar from "@/components/game/ToolBar";
import ChatBox from "@/components/game/ChatBox";
import WordSelector from "@/components/game/WordSelector";
import ScoreBoard from "@/components/game/ScoreBoard";

export default function GamePage() {
	const room = useGameStore((s) => s.room);
	const navigate = useNavigate();

	useEffect(() => {
		if (!room) navigate("/");
	}, [room, navigate]);

	if (!room) return null;

	return (
		<div className="h-screen flex flex-col bg-muted/30">
			<TopBar />
			<div className="flex-1 grid grid-cols-[200px_1fr_280px] gap-2 p-2 overflow-hidden">
				<PlayerList />
				<div className="flex flex-col gap-2 overflow-hidden">
					<DrawingCanvas />
					<ToolBar />
				</div>
				<ChatBox />
			</div>
			<WordSelector />
			<ScoreBoard />
		</div>
	);
}
