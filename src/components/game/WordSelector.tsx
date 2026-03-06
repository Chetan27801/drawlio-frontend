import { useState, useEffect, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { ClientEvents } from "@/constants/events";
import { GAME_CONSTANTS } from "@/constants/game";
import { useGameStore } from "@/stores/gameStore";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function WordSelector() {
	const { wordOptions, currentDrawerId, playerId } = useGameStore();
	const isDrawer = currentDrawerId === playerId;
	const open = isDrawer && wordOptions !== null && wordOptions.length > 0;

	const [countdown, setCountdown] = useState(
		GAME_CONSTANTS.WORD_SELECTION_TIME,
	);

	useEffect(() => {
		if (!open) {
			setCountdown(GAME_CONSTANTS.WORD_SELECTION_TIME);
			return;
		}

		setCountdown(GAME_CONSTANTS.WORD_SELECTION_TIME);
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [open]);

	const handleSelect = useCallback((word: string) => {
		getSocket().emit(ClientEvents.SELECT_WORD, { word });
		useGameStore.setState({ wordOptions: null });
	}, []);

	if (!open) return null;

	return (
		<Dialog open={open}>
			<DialogContent
				className="sm:max-w-md"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="text-center">Choose a word to draw</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex gap-3 justify-center">
						{wordOptions!.map((word) => (
							<Button
								key={word}
								variant="outline"
								size="lg"
								className="text-lg font-medium px-6 py-8 hover:bg-violet-50 hover:border-violet-300"
								onClick={() => handleSelect(word)}
							>
								{word}
							</Button>
						))}
					</div>
					<div className="space-y-1">
						<Progress
							value={
								(countdown / GAME_CONSTANTS.WORD_SELECTION_TIME) * 100
							}
							className="h-2"
						/>
						<p className="text-center text-sm text-muted-foreground">
							{countdown}s remaining
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
