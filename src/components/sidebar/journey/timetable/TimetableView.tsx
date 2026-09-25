import { Info, RouteOff } from "lucide-react";
import { Button } from "../../../ui/button";
import StopTimeReadout from "../StopTimeReadout";
import TimetableLineSegment from "./TimetableLineSegment";
import type { Stop } from "@/lib/departuresStruct";
import { cn } from "@/lib/utils.ts";
import { getCurrentStopThenOne } from "@/lib/getCurrentStopThenOne.ts";
import type { SidebarEventConsumer } from "@/lib/sidebarEvents/sidebarEventConsumer";
import SidebarLocateTiplocEvent from "@/lib/sidebarEvents/sidebarLocateTiplocEvent";

export default function TimetableView({ Stops, onEvent }: { Stops: Stop[], onEvent: SidebarEventConsumer }) {
	const currentStop = getCurrentStopThenOne(Stops);
	if (Stops.length > 0) {
		return Stops.map((element, index) => (
			<div className="flex flex-row gap-4 px-4 odd:bg-background ">
				<TimetableLineSegment
					startEnd={
						// If this is the start, return positive sign
						index === 0 ? 1
							// If this is the end, return negative sign
							: index === Stops.length - 1 ? -1
								// Mid stops are 0
								: 0
					}
					isCurrent={element === currentStop}
					isDisabled={element.Passed}
				/>
				<StopDescriptor Stop={element} onEvent={onEvent} />
			</div>
		));
	} else {
		return (
			<div className="flex items-center flex-col pt-30 gap-5">
				<RouteOff className="size-30" color="#9ca3af" />
				<h2 className="h2 text-gray-400">No Route Information Available</h2>
			</div>
		);
	}
}

function StopDescriptor({ Stop, onEvent }: { Stop: Stop, onEvent: SidebarEventConsumer }) {
	return (
		<>
			<div className="flex flex-col gap-1.25 grow-3 justify-center">
				<h3 className={cn("thin-h", Stop.Name.length > 15 && (Stop.isLate || Stop.isEarly) ? "h5" : "h4")}>{Stop.Name}</h3>
				<StopTimeReadout Subject={Stop} />
			</div>
			{
				Stop.Tiploc ? <Button variant="dotbutton" className="self-center grow-0 justify-self-end ml-1 mr-2" size="icon-lg" onClick={() => onEvent(new SidebarLocateTiplocEvent(Stop.Tiploc))}>
					<Info />
				</Button>
				: null
			}
		</>
	);
}