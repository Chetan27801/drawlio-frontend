import { useGameStore } from "@/stores/gameStore";
import { Clock } from "lucide-react";

export default function TopBar() {
	const {
		currentRound,
		playerId,
		currentDrawerId,
		selectedWord,
		wordHint,
		timeRemaining,
	} = useGameStore();
	const room = useGameStore((s) => s.room);
	const isDrawing = currentDrawerId === playerId;

	const wordDisplay = () => {
		if (isDrawing && selectedWord) return selectedWord;
		if (wordHint) return wordHint;
		if (currentDrawerId) return "Waiting for word...";
		return "Waiting for turn...";
	};

	return (
		<div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
			<div className="text-sm font-medium text-muted-foreground">
				Round{" "}
				<span className="text-foreground font-bold text-base">
					{currentRound}
				</span>{" "}
				/ {room?.settings.roundsPerGame ?? "?"}
			</div>

			<div className="flex flex-col items-center">
				<span
					className={`font-mono text-2xl tracking-[0.2em] font-bold ${
						isDrawing ? "text-violet-600" : "text-foreground"
					}`}
				>
					{wordDisplay()}
				</span>
				{isDrawing && selectedWord && (
					<span className="text-xs text-muted-foreground">
						You are drawing!
					</span>
				)}
			</div>

			<div
				className={`flex items-center gap-2 font-mono text-lg font-bold ${
					timeRemaining <= 10 ? "text-red-500" : "text-foreground"
				}`}
			>
				<Clock
					className={`h-5 w-5 ${timeRemaining <= 10 ? "animate-pulse" : ""}`}
				/>
				{timeRemaining}s
			</div>
		</div>
	);
}
