import { useRef, useEffect, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { ClientEvents } from "@/constants/events";
import { useCanvasStore } from "@/stores/canvasStore";
import { GAME_CONSTANTS } from "@/constants/game";
import type { DrawStroke } from "@/types";

const CANVAS_W = GAME_CONSTANTS.CANVAS_WIDTH;
const CANVAS_H = GAME_CONSTANTS.CANVAS_HEIGHT;

export function useCanvas(
	canvasRef: React.RefObject<HTMLCanvasElement | null>,
	isDrawer: boolean,
) {
	const isDrawingRef = useRef(false);
	const lastPosRef = useRef({ x: 0, y: 0 });

	const drawStroke = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			stroke: DrawStroke,
			canvasEl: HTMLCanvasElement,
		) => {
			const scaleX = canvasEl.width / CANVAS_W;
			const scaleY = canvasEl.height / CANVAS_H;

			ctx.beginPath();
			ctx.moveTo(stroke.prevX * scaleX, stroke.prevY * scaleY);
			ctx.lineTo(stroke.x * scaleX, stroke.y * scaleY);
			ctx.strokeStyle = stroke.color;
			ctx.lineWidth = stroke.width * scaleX;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.stroke();
		},
		[],
	);

	useEffect(() => {
		const socket = getSocket();
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const handleRemoteStroke = (stroke: DrawStroke) => {
			drawStroke(ctx, stroke, canvas);
		};

		const handleClear = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		};

		socket.on("draw_data", handleRemoteStroke);
		socket.on("canvas_cleared", handleClear);

		return () => {
			socket.off("draw_data", handleRemoteStroke);
			socket.off("canvas_cleared", handleClear);
		};
	}, [canvasRef, drawStroke]);

	const getPos = useCallback(
		(e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
			const rect = canvas.getBoundingClientRect();
			const scaleX = CANVAS_W / canvas.width;
			const scaleY = CANVAS_H / canvas.height;
			return {
				x: (e.clientX - rect.left) * scaleX,
				y: (e.clientY - rect.top) * scaleY,
			};
		},
		[],
	);

	const startDrawing = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!isDrawer) return;
			const canvas = canvasRef.current;
			if (!canvas) return;

			isDrawingRef.current = true;
			const point = e instanceof MouseEvent ? e : e.touches[0];
			const pos = getPos(point, canvas);
			lastPosRef.current = pos;
		},
		[isDrawer, canvasRef, getPos],
	);

	const draw = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!isDrawer || !isDrawingRef.current) return;
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const point = e instanceof MouseEvent ? e : e.touches[0];
			const pos = getPos(point, canvas);
			const { color, brushWidth, tool } = useCanvasStore.getState();
			const strokeColor = tool === "eraser" ? "#FFFFFF" : color;

			const stroke: DrawStroke = {
				x: pos.x,
				y: pos.y,
				prevX: lastPosRef.current.x,
				prevY: lastPosRef.current.y,
				color: strokeColor,
				width: brushWidth,
				timestamp: Date.now(),
			};

			drawStroke(ctx, stroke, canvas);

			getSocket().emit(ClientEvents.DRAW, {
				x: stroke.x,
				y: stroke.y,
				prevX: stroke.prevX,
				prevY: stroke.prevY,
				color: stroke.color,
				width: stroke.width,
			});

			lastPosRef.current = pos;
		},
		[isDrawer, canvasRef, getPos, drawStroke],
	);

	const stopDrawing = useCallback(() => {
		isDrawingRef.current = false;
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.addEventListener("mousedown", startDrawing);
		canvas.addEventListener("mousemove", draw);
		canvas.addEventListener("mouseup", stopDrawing);
		canvas.addEventListener("mouseleave", stopDrawing);
		canvas.addEventListener("touchstart", startDrawing, { passive: true });
		canvas.addEventListener("touchmove", draw, { passive: true });
		canvas.addEventListener("touchend", stopDrawing);

		return () => {
			canvas.removeEventListener("mousedown", startDrawing);
			canvas.removeEventListener("mousemove", draw);
			canvas.removeEventListener("mouseup", stopDrawing);
			canvas.removeEventListener("mouseleave", stopDrawing);
			canvas.removeEventListener("touchstart", startDrawing);
			canvas.removeEventListener("touchmove", draw);
			canvas.removeEventListener("touchend", stopDrawing);
		};
	}, [canvasRef, startDrawing, draw, stopDrawing]);

	const clearCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
		getSocket().emit(ClientEvents.CLEAR_CANVAS);
	}, [canvasRef]);

	return { clearCanvas };
}
