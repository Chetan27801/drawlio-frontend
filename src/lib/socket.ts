import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
	if (!socket) {
		socket = io(URL, {
			autoConnect: false,
			transports: ["websocket", "polling"],
		});
	}

	return socket;
};

export const connectSocket = (): Socket => {
	const s = getSocket();
	if (!s.connected) s.connect();

	return s;
};

export const disconnectSocket = (): void => {
	socket?.disconnect();
	socket = null;
};
