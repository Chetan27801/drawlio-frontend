import { getSocket } from "@/lib/socket";
import { ClientEvents } from "@/constants/events";
import { useGameStore } from "@/stores/gameStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Eraser, Trash2 } from "lucide-react";

const COLORS = [
	"#000000",
	"#808080",
	"#FF0000",
	"#FF8000",
	"#FFFF00",
	"#00FF00",
	"#00FFFF",
	"#0000FF",
	"#8000FF",
	"#FF00FF",
	"#FFFFFF",
	"#804000",
];

export default function ToolBar() {
	const { playerId, currentDrawerId } = useGameStore();
	const { color, brushWidth, tool, setColor, setBrushWidth, setTool } =
		useCanvasStore();
	const isDrawer = currentDrawerId === playerId;

	if (!isDrawer) return null;

	const handleClear = () => {
		getSocket().emit(ClientEvents.CLEAR_CANVAS);
	};

	return (
		<div className="bg-white rounded-lg border px-4 py-2 flex items-center gap-4">
			<div className="flex items-center gap-1.5">
				{COLORS.map((c) => (
					<button
						key={c}
						onClick={() => {
							setColor(c);
							setTool("pen");
						}}
						className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
							color === c && tool === "pen"
								? "border-violet-500 scale-110"
								: "border-gray-300"
						}`}
						style={{ backgroundColor: c }}
					/>
				))}
			</div>

			<div className="h-6 w-px bg-border" />

			<div className="flex items-center gap-2 min-w-[120px]">
				<span className="text-xs text-muted-foreground whitespace-nowrap">
					Size
				</span>
				<Slider
					min={1}
					max={20}
					step={1}
					value={[brushWidth]}
					onValueChange={([v]) => setBrushWidth(v)}
					className="w-20"
				/>
				<span className="text-xs font-mono w-5 text-right">{brushWidth}</span>
			</div>

			<div className="h-6 w-px bg-border" />

			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={tool === "pen" ? "default" : "ghost"}
							size="icon"
							className="h-8 w-8"
							onClick={() => setTool("pen")}
						>
							<Pencil className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Pen</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={tool === "eraser" ? "default" : "ghost"}
							size="icon"
							className="h-8 w-8"
							onClick={() => setTool("eraser")}
						>
							<Eraser className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Eraser</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-destructive hover:text-destructive"
							onClick={handleClear}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Clear canvas</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
