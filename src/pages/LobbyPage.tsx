import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@/lib/socket";
import { ClientEvents } from "@/constants/events";
import { GAME_CONSTANTS } from "@/constants/game";
import { useGameStore } from "@/stores/gameStore";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Crown, Copy, Check, LogOut, Play } from "lucide-react";
import { useState } from "react";

export default function LobbyPage() {
	const { room, playerId } = useGameStore();
	const navigate = useNavigate();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!room) navigate("/");
	}, [room, navigate]);

	if (!room) return null;

	const isHost = room.hostId === playerId;
	const canStart = isHost && room.players.length >= GAME_CONSTANTS.MIN_PLAYERS;

	const copyCode = async () => {
		await navigator.clipboard.writeText(room.code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleStart = () => {
		getSocket().emit(ClientEvents.START_GAME);
	};

	const handleLeave = () => {
		getSocket().emit(ClientEvents.LEAVE_ROOM);
		useGameStore.getState().reset();
		navigate("/");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-blue-50 to-cyan-100 p-4">
			<Card className="w-full max-w-lg shadow-xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Game Lobby</CardTitle>
					<div className="flex items-center justify-center gap-2 mt-3">
						<span className="font-mono text-3xl tracking-[0.3em] font-bold text-violet-600">
							{room.code}
						</span>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon" onClick={copyCode}>
									{copied ? (
										<Check className="h-4 w-4 text-green-500" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{copied ? "Copied!" : "Copy room code"}
							</TooltipContent>
						</Tooltip>
					</div>
					<p className="text-muted-foreground text-sm mt-1">
						Share this code with friends to join
					</p>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<span>
							Players ({room.players.length}/{room.settings.maxPlayers})
						</span>
						<span>
							{room.settings.roundsPerGame} rounds &middot;{" "}
							{room.settings.drawTime}s draw time
						</span>
					</div>

					<div className="space-y-2">
						{room.players.map((player) => (
							<div
								key={player.id}
								className="flex items-center justify-between rounded-lg border p-3"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-semibold text-sm">
										{player.name.charAt(0).toUpperCase()}
									</div>
									<span
										className={`font-medium ${player.id === playerId ? "text-violet-600" : ""}`}
									>
										{player.name}
										{player.id === playerId && (
											<span className="text-xs text-muted-foreground ml-1">
												(you)
											</span>
										)}
									</span>
								</div>
								<div className="flex items-center gap-2">
									{player.isHost && (
										<Badge variant="secondary" className="gap-1">
											<Crown className="h-3 w-3" />
											Host
										</Badge>
									)}
								</div>
							</div>
						))}
					</div>

					<Separator />

					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1"
							onClick={handleLeave}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Leave
						</Button>
						{isHost && (
							<Button
								className="flex-1"
								disabled={!canStart}
								onClick={handleStart}
							>
								<Play className="mr-2 h-4 w-4" />
								Start Game
								{!canStart && (
									<span className="ml-1 text-xs">
										(need {GAME_CONSTANTS.MIN_PLAYERS}+)
									</span>
								)}
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
