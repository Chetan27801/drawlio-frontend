import { useState } from "react";
import { connectSocket } from "@/lib/socket";
import { ClientEvents } from "@/constants/events";
import { Difficulty, GAME_CONSTANTS } from "@/constants/game";
import { useGameStore } from "@/stores/gameStore";
import type { CreateRoomPayload, JoinRoomPayload } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Pencil, Users, LogIn } from "lucide-react";

export default function HomePage() {
	const [name, setName] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [maxPlayers, setMaxPlayers] = useState(GAME_CONSTANTS.MAX_PLAYERS);
	const [rounds, setRounds] = useState(GAME_CONSTANTS.DEFAULT_ROUNDS);
	const [drawTime, setDrawTime] = useState(GAME_CONSTANTS.DEFAULT_DRAW_TIME);
	const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
	const [dialogOpen, setDialogOpen] = useState(false);

	const emitAfterConnect = (emitFn: () => void) => {
		const socket = connectSocket();
		if (useGameStore.getState().playerId) {
			emitFn();
		} else {
			socket.once("connected", () => emitFn());
		}
	};

	const handleCreateRoom = () => {
		if (!name.trim()) return;
		setDialogOpen(false);
		emitAfterConnect(() => {
			connectSocket().emit(ClientEvents.CREATE_ROOM, {
				playerName: name.trim(),
				settings: { maxPlayers, roundsPerGame: rounds, drawTime, difficulty },
			} satisfies CreateRoomPayload);
		});
	};

	const handleJoinRoom = () => {
		if (!name.trim() || !roomCode.trim()) return;
		emitAfterConnect(() => {
			connectSocket().emit(ClientEvents.JOIN_ROOM, {
				code: roomCode.trim().toUpperCase(),
				playerName: name.trim(),
			} satisfies JoinRoomPayload);
		});
	};

	const canInteract = name.trim().length > 0;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-blue-50 to-cyan-100 p-4">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader className="text-center pb-2">
					<div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
						<Pencil className="h-8 w-8" />
					</div>
					<CardTitle className="text-3xl font-bold tracking-tight">
						drawlio
					</CardTitle>
					<p className="text-muted-foreground text-sm mt-1">
						Draw, guess, and have fun with friends
					</p>
				</CardHeader>

				<CardContent className="space-y-6 pt-2">
					<div className="space-y-2">
						<Label htmlFor="name">Your Name</Label>
						<Input
							id="name"
							placeholder="Enter your name..."
							value={name}
							onChange={(e) => setName(e.target.value)}
							maxLength={20}
							onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
						/>
					</div>

					<Separator />

					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogTrigger asChild>
							<Button className="w-full" size="lg" disabled={!canInteract}>
								<Users className="mr-2 h-4 w-4" />
								Create Room
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Room Settings</DialogTitle>
							</DialogHeader>
							<div className="space-y-5 py-2">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label>Max Players</Label>
										<span className="text-sm font-medium">{maxPlayers}</span>
									</div>
									<Slider
										min={GAME_CONSTANTS.MIN_PLAYERS}
										max={GAME_CONSTANTS.MAX_PLAYERS}
										step={1}
										value={[maxPlayers]}
										onValueChange={([v]) => setMaxPlayers(v)}
									/>
								</div>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label>Rounds</Label>
										<span className="text-sm font-medium">{rounds}</span>
									</div>
									<Slider
										min={1}
										max={10}
										step={1}
										value={[rounds]}
										onValueChange={([v]) => setRounds(v)}
									/>
								</div>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label>Draw Time (seconds)</Label>
										<span className="text-sm font-medium">{drawTime}s</span>
									</div>
									<Slider
										min={30}
										max={120}
										step={10}
										value={[drawTime]}
										onValueChange={([v]) => setDrawTime(v)}
									/>
								</div>
								<div className="space-y-2">
									<Label>Difficulty</Label>
									<Select
										value={difficulty}
										onValueChange={(v) => setDifficulty(v as Difficulty)}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={Difficulty.EASY}>Easy</SelectItem>
											<SelectItem value={Difficulty.MEDIUM}>Medium</SelectItem>
											<SelectItem value={Difficulty.HARD}>Hard</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<DialogFooter>
								<Button onClick={handleCreateRoom} className="w-full">
									Create Room
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">or</span>
						</div>
					</div>

					<div className="space-y-3">
						<Input
							placeholder="Enter room code..."
							value={roomCode}
							onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
							maxLength={GAME_CONSTANTS.ROOM_CODE_LENGTH}
							className="text-center font-mono text-lg tracking-widest"
							onKeyDown={(e) => {
								if (e.key === "Enter") handleJoinRoom();
							}}
						/>
						<Button
							variant="outline"
							className="w-full"
							size="lg"
							disabled={!canInteract || roomCode.trim().length === 0}
							onClick={handleJoinRoom}
						>
							<LogIn className="mr-2 h-4 w-4" />
							Join Room
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
