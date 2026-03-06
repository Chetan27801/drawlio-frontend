import { useRef, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useCanvas } from "@/hooks/useCanvas";
import { GAME_CONSTANTS } from "@/constants/game";

export default function DrawingCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const { playerId, currentDrawerId } = useGameStore();
	const isDrawer = currentDrawerId === playerId;

	useCanvas(canvasRef, isDrawer);

	useEffect(() => {
		const resize = () => {
			const container = containerRef.current;
			const canvas = canvasRef.current;
			if (!container || !canvas) return;

			const w = container.clientWidth;
			const h =
				w * (GAME_CONSTANTS.CANVAS_HEIGHT / GAME_CONSTANTS.CANVAS_WIDTH);
			canvas.width = w;
			canvas.height = Math.min(h, container.clientHeight);
		};
		resize();
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
	}, []);

	return (
		<div
			ref={containerRef}
			className="flex-1 bg-white rounded-lg border overflow-hidden"
		>
			<canvas
				ref={canvasRef}
				className={`w-full h-full ${isDrawer ? "cursor-crosshair" : "cursor-default"}`}
			/>
		</div>
	);
}
