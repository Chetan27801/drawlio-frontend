import { useGameStore } from "@/stores/gameStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, Pencil, CheckCircle } from "lucide-react";

export default function PlayerList() {
	const { room, currentDrawerId, playerId } = useGameStore();
	const players = room?.players ?? [];

	const sorted = [...players].sort((a, b) => b.score - a.score);

	return (
		<div className="bg-white rounded-lg border flex flex-col overflow-hidden">
			<div className="px-3 py-2 border-b bg-muted/50">
				<h3 className="text-sm font-semibold">Players</h3>
			</div>
			<ScrollArea className="flex-1">
				<div className="p-2 space-y-1">
					{sorted.map((player, idx) => (
						<div
							key={player.id}
							className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${
								player.id === currentDrawerId
									? "bg-violet-50 border border-violet-200"
									: "hover:bg-muted/50"
							}`}
						>
							<div className="relative">
								<div
									className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
										idx === 0
											? "bg-amber-100 text-amber-700"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{player.name.charAt(0).toUpperCase()}
								</div>
								{player.hasGuessed && (
									<CheckCircle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 text-green-500 fill-white" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-1">
									<span
										className={`truncate font-medium ${
											player.id === playerId ? "text-violet-600" : ""
										}`}
									>
										{player.name}
									</span>
									{player.isHost && (
										<Crown className="h-3 w-3 text-amber-500 shrink-0" />
									)}
									{player.id === currentDrawerId && (
										<Pencil className="h-3 w-3 text-violet-500 shrink-0" />
									)}
								</div>
							</div>
							<span className="font-mono text-xs font-bold tabular-nums">
								{player.score}
							</span>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
