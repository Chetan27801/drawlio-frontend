import { create } from "zustand";
import type { PlayerData, RoomData } from "@/types";

interface Message {
	id: string;
	playerId: string;
	playerName: string;
	message: string;
	type: "chat" | "correct" | "system";
}

interface GameResult {
	finalScores: { id: string; name: string; score: number }[];
	winner: { id: string; name: string; score: number };
}

interface GameStore {
	playerId: string | null;
	isConnected: boolean;
	room: RoomData | null;
	currentRound: number;
	currentDrawerId: string | null;
	timeRemaining: number;
	wordHint: string | null;
	selectedWord: string | null;
	wordOptions: string[] | null;
	messages: Message[];
	gameResult: GameResult | null;

	setConnected: (playerId: string) => void;
	setRoom: (room: RoomData) => void;
	addPlayer: (player: PlayerData) => void;
	removePlayer: (playerId: string) => void;
	setTurn: (drawerId: string) => void;
	setTimer: (remaining: number) => void;
	setWordOptions: (words: string[]) => void;
	setSelectedWord: (word: string) => void;
	setWordHint: (hint: string) => void;
	addMessage: (msg: Omit<Message, "id">) => void;
	updateScores: (scores: { id: string; score: number }[]) => void;
	reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
	playerId: null,
	isConnected: false,
	room: null,
	currentRound: 0,
	currentDrawerId: null,
	timeRemaining: 0,
	wordHint: null,
	selectedWord: null,
	wordOptions: null,
	messages: [],
	gameResult: null,
	setConnected: (playerId) => set({ playerId, isConnected: true }),
	setRoom: (room) => set({ room }),
	addPlayer: (player) =>
		set((state) => {
			if (!state.room) return state;
			return {
				room: { ...state.room, players: [...state.room.players, player] },
			};
		}),
	removePlayer: (playerId) =>
		set((state) => {
			if (!state.room) return state;
			return {
				room: {
					...state.room,
					players: state.room.players.filter((p) => p.id !== playerId),
				},
			};
		}),
	setTurn: (drawerId) => set({ currentDrawerId: drawerId }),
	setTimer: (remaining) => set({ timeRemaining: remaining }),
	setWordOptions: (words) => set({ wordOptions: words }),
	setSelectedWord: (word) => set({ selectedWord: word }),
	setWordHint: (hint) => set({ wordHint: hint }),
	addMessage: (msg) =>
		set((state) => ({
			messages: [...state.messages, { ...msg, id: crypto.randomUUID() }],
		})),
	updateScores: (scores) =>
		set((state) => {
			if (!state.room) return state;

			return {
				room: {
					...state.room,
					players: state.room.players.map((p) => {
						const updated = scores.find((s) => s.id === p.id);
						return updated ? { ...p, score: updated.score } : p;
					}),
				},
			};
		}),
	reset: () =>
		set({
			playerId: null,
			isConnected: false,
			room: null,
			currentRound: 0,
			currentDrawerId: null,
			timeRemaining: 0,
			wordHint: null,
			selectedWord: null,
			wordOptions: null,
			messages: [],
			gameResult: null,
		}),
}));
