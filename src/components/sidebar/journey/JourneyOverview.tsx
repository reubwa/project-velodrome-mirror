import { LogIn, LogOut } from "lucide-react";
import StopTimeReadout from "./StopTimeReadout";
import type { Stop } from "@/lib/departuresStruct.ts";
import { getCurrentStop } from "@/lib/getCurrentStop.ts";
import { hasJourneyHappened } from "@/lib/hasJourneyHappened.ts";

/**
 * Collects last reported stop, or null if it is not available/relevant.
 */
function GetLastReported(Stops: Stop[]): Stop | null {
	const Current = getCurrentStop(Stops);
	// There is no current stop / it is not relevant, if;
	if (
		(!Current.actualTime) || // The journey has not started.
		hasJourneyHappened(Stops) || // The journey has ended.
		Current === Stops[Stops.length - 1] // Current is the Arrival point.
	) { return null; }
	return Current;
}

export default function JourneyOverview({ Stops }: { Stops: Stop[] }) {
	const Departure = Stops[0];
	const LastReported = GetLastReported(Stops);
	const Arrival = Stops[Stops.length - 1];

	return (<>
		<div className="flex flex-row p-2 px-6 gap-6 items-center">
			<img src="overview/departure.svg" alt="Departure Point Icon" className="max-w-16" />

			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row items-center gap-4">
					<LogOut />
					<h2 className="h2">Departs from</h2>
				</div>
				<h3 className="h3 thin-h">{Departure.Name}</h3>

				<StopTimeReadout Subject={Departure} />
			</div>
		</div>
		{
			LastReported ? <div className="flex flex-row p-2 px-6 gap-4 items-center bg-background text-foreground/80">
				<img src="overview/current.svg" alt="Current Location Icon" className="max-w-16" />

				<div className="flex flex-col gap-2 w-full">
					<h4 className="h3">Last Reported Location</h4>
					<h4 className="h4 thin-h">{LastReported.Name}</h4>
					<StopTimeReadout Subject={LastReported} />
				</div>
			</div> : <hr/>
		}
		<div className="flex flex-row p-2 px-6 gap-4 items-center">
			<img src="overview/arrival.svg" alt="Arrival Point Icon" className="max-w-16" />

			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row items-center gap-4">
					<LogIn />
					<h2 className="h2">Arrives at</h2>
				</div>
				<h3 className="h3 thin-h">{Arrival.Name}</h3>
				<StopTimeReadout Subject={Arrival} />
			</div>
		</div>
	</>
	);
}