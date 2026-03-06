import { create } from "zustand";

interface CanvasStore {
	color: string;
	brushWidth: number;
	tool: "pen" | "eraser";
	setColor: (color: string) => void;
	setBrushWidth: (width: number) => void;
	setTool: (tool: "pen" | "eraser") => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
	color: "#000000",
	brushWidth: 5,
	tool: "pen",
	setColor: (color) => set({ color }),
	setBrushWidth: (brushWidth) => set({ brushWidth }),
	setTool: (tool) => set({ tool }),
}));


