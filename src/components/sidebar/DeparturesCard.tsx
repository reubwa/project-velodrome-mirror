import {OctagonX, SquareArrowOutUpRight, TrainFront} from "lucide-react";
import type { Departure } from "@/lib/departuresStruct";
import { cn } from "@/lib/utils";
import {dateformat} from "@/lib/dateFormat.ts";



export default function DeparturesCard(
    { departure, clickHandler, disable }:
        { departure: Departure, clickHandler: React.MouseEventHandler, disable: boolean }
) {	
	const formattedtime = dateformat(new Date(departure.Time));

    return (
		<button onClick={disable ? undefined : clickHandler} className={cn(`
		border border-border border-l-4 rounded-md
		flex flex-row grow place-content-between place-items-start gap-2 p-4
		transition-all transition-250ms ease-out
		text-left
		`, disable ? "opacity-50" : "hover:scale-105 hover:shadow-md cursor-pointer", departure.isCancelled ? "border-l-red-700" : "border-l-primary")}>
			<div className="flex flex-col gap-2">
				<p className={cn("font-bold!", departure.isCancelled ? "line-through" : "")}>{formattedtime}</p>
				<h2 className={cn("h2 font-semibold!", departure.isCancelled ? "line-through" : "")}>{departure.Destination}</h2>
				<span className="flex flex-row place-items-center gap-2">
					<TrainFront className="size-4"/> 
					<span>{departure.trainUid}</span>
				</span>
			</div>
			<div className="flex flex-col gap-15">
				<SquareArrowOutUpRight className="size-6"/>
				{departure.isCancelled ? <OctagonX className="size-6 text-red-700"/> : ""}
			</div>
		</button>
    );
}