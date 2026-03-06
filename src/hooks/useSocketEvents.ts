import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@/lib/socket";
import { ServerEvents } from "@/constants/events";
import { useGameStore } from "@/stores/gameStore";

export function useSocketEvents() {
	const navigate = useNavigate();

	useEffect(() => {
		const socket = getSocket();
		const store = () => useGameStore.getState();

		socket.on("connected", ({ playerId }: { playerId: string }) => {
			store().setConnected(playerId);
		});

		socket.on(ServerEvents.ROOM_CREATED, (data) => {
			store().setRoom(data);
			navigate(`/lobby/${data.code}`);
		});

		socket.on(ServerEvents.ROOM_JOINED, (data) => {
			store().setRoom(data);
			navigate(`/lobby/${data.code}`);
		});

		socket.on(ServerEvents.PLAYER_JOINED, (player) => {
			store().addPlayer(player);
		});

		socket.on(
			ServerEvents.PLAYER_LEFT,
			({ playerId }: { playerId: string }) => {
				store().removePlayer(playerId);
			},
		);

		socket.on(ServerEvents.GAME_STARTED, () => {
			const room = store().room;
			if (room) navigate(`/game/${room.code}`);
		});

		socket.on(ServerEvents.ROUND_STARTED, ({ round }: { round: number }) => {
			useGameStore.setState({ currentRound: round });
		});

		socket.on(
			ServerEvents.TURN_STARTED,
			({ drawerId }: { drawerId: string }) => {
				store().setTurn(drawerId);
				useGameStore.setState({
					wordHint: null,
					selectedWord: null,
					wordOptions: null,
				});
			},
		);

		socket.on(ServerEvents.WORD_OPTIONS, ({ words }: { words: string[] }) => {
			store().setWordOptions(words);
		});

		socket.on("word_selected", ({ word }: { word: string }) => {
			store().setSelectedWord(word);
		});

		socket.on(
			"word_hint",
			({ hint }: { hint: string }) => {
				store().setWordHint(hint);
			},
		);

		socket.on("hint_revealed", ({ hint }: { hint: string }) => {
			store().setWordHint(hint);
		});

		socket.on(
			"drawing_started",
			({ timeLimit }: { drawerId: string; timeLimit: number }) => {
				store().setTimer(timeLimit);
			},
		);

		socket.on(
			ServerEvents.TIMER_UPDATE,
			({ remaining }: { remaining: number }) => {
				store().setTimer(remaining);
			},
		);

		socket.on(
			ServerEvents.MESSAGE,
			(msg: { playerId: string; playerName: string; message: string }) => {
				store().addMessage({ ...msg, type: "chat" });
			},
		);

		socket.on(
			ServerEvents.CORRECT_GUESS,
			(data: { playerId: string; playerName: string; points: number }) => {
				store().addMessage({
					playerId: data.playerId,
					playerName: data.playerName,
					message: `guessed the word! +${data.points} points`,
					type: "correct",
				});
			},
		);

		socket.on(
			ServerEvents.TURN_ENDED,
			(data: {
				word: string;
				scores: { id: string; name: string; score: number }[];
			}) => {
				store().updateScores(data.scores);
				store().addMessage({
					playerId: "system",
					playerName: "System",
					message: `The word was: ${data.word}`,
					type: "system",
				});
				useGameStore.setState({
					currentDrawerId: null,
					selectedWord: null,
					wordHint: null,
				});
			},
		);

		socket.on(
			ServerEvents.ROUND_ENDED,
			(data: {
				round: number;
				scores: { id: string; name: string; score: number }[];
			}) => {
				store().updateScores(data.scores);
			},
		);

		socket.on(
			ServerEvents.GAME_ENDED,
			(data: {
				finalScores: { id: string; name: string; score: number }[];
				winner: { id: string; name: string; score: number };
			}) => {
				useGameStore.setState({ gameResult: data });
			},
		);

		socket.on("game_reset", () => {
			const room = store().room;
			useGameStore.setState({
				currentDrawerId: null,
				timeRemaining: 0,
				wordHint: null,
				selectedWord: null,
				wordOptions: null,
				messages: [],
				gameResult: null,
				currentRound: 0,
			});
			if (room) navigate(`/lobby/${room.code}`);
		});

		socket.on(ServerEvents.ERROR, (data: { message: string }) => {
			store().addMessage({
				playerId: "system",
				playerName: "System",
				message: data.message,
				type: "system",
			});
		});

		return () => {
			socket.removeAllListeners();
		};
	}, [navigate]);
}
