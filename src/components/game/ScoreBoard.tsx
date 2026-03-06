import { useNavigate } from "react-router-dom";
import { getSocket } from "@/lib/socket";
import { ClientEvents } from "@/constants/events";
import { useGameStore } from "@/stores/gameStore";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Medal } from "lucide-react";

export default function ScoreBoard() {
	const gameResult = useGameStore((s) => s.gameResult);
	const navigate = useNavigate();

	if (!gameResult) return null;

	const scores = [...gameResult.finalScores].sort(
		(a, b) => b.score - a.score,
	);

	const handleLeave = () => {
		getSocket().emit(ClientEvents.LEAVE_ROOM);
		useGameStore.getState().reset();
		navigate("/");
	};

	const getMedalColor = (idx: number) => {
		if (idx === 0) return "text-amber-500";
		if (idx === 1) return "text-gray-400";
		if (idx === 2) return "text-amber-700";
		return "text-transparent";
	};

	return (
		<Dialog open>
			<DialogContent
				className="sm:max-w-md"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="text-center flex items-center justify-center gap-2 text-xl">
						<Trophy className="h-6 w-6 text-amber-500" />
						Game Over
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						{scores.map((player, idx) => (
							<div
								key={player.id}
								className={`flex items-center gap-3 rounded-lg p-3 ${
									idx === 0
										? "bg-amber-50 border border-amber-200"
										: "border"
								}`}
							>
								<div className="flex items-center gap-2 w-8">
									{idx < 3 ? (
										<Medal
											className={`h-5 w-5 ${getMedalColor(idx)}`}
										/>
									) : (
										<span className="text-sm text-muted-foreground ml-1">
											{idx + 1}
										</span>
									)}
								</div>
								<div className="flex-1">
									<span
										className={`font-medium ${idx === 0 ? "text-amber-700" : ""}`}
									>
										{player.name}
									</span>
								</div>
								<span className="font-mono font-bold tabular-nums">
									{player.score}
								</span>
							</div>
						))}
					</div>
					<Button onClick={handleLeave} className="w-full" variant="outline">
						Back to Home
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
