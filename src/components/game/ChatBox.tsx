import { useState, useRef, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { ClientEvents } from "@/constants/events";
import { useGameStore } from "@/stores/gameStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ChatBox() {
	const { messages, currentDrawerId, playerId } = useGameStore();
	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const isDrawer = currentDrawerId === playerId;

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = () => {
		const text = input.trim();
		if (!text) return;
		getSocket().emit(ClientEvents.SEND_MESSAGE, { message: text });
		setInput("");
	};

	return (
		<div className="bg-white rounded-lg border flex flex-col overflow-hidden">
			<div className="px-3 py-2 border-b bg-muted/50">
				<h3 className="text-sm font-semibold">Chat</h3>
			</div>
			<ScrollArea className="flex-1 px-3">
				<div className="py-2 space-y-1.5">
					{messages.map((msg) => (
						<div key={msg.id} className="text-sm break-words">
							{msg.type === "system" ? (
								<span className="italic text-muted-foreground">
									{msg.message}
								</span>
							) : msg.type === "correct" ? (
								<span className="text-green-600 font-medium">
									{msg.playerName} {msg.message}
								</span>
							) : (
								<>
									<span className="font-semibold">{msg.playerName}: </span>
									<span>{msg.message}</span>
								</>
							)}
						</div>
					))}
					<div ref={scrollRef} />
				</div>
			</ScrollArea>
			<div className="p-2 border-t">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSend();
					}}
					className="flex gap-2"
				>
					<Input
						placeholder={isDrawer ? "You're drawing..." : "Type your guess..."}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						disabled={isDrawer}
						className="text-sm"
					/>
					<Button
						type="submit"
						size="icon"
						disabled={isDrawer || !input.trim()}
					>
						<Send className="h-4 w-4" />
					</Button>
				</form>
			</div>
		</div>
	);
}
