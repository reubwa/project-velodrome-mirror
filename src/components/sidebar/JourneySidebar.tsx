import { AlertCircle, Minimize2, TrainFront, Undo2 } from "lucide-react";
import { useState, useEffect, useEffectEvent } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Tabs, TabsTrigger, TabsList } from "../ui/tabs";
import { SidebarHeaderActionButton } from "./SidebarHeaderActionButton";
import TimetableView from "./journey/timetable/TimetableView";
import Refresher from "./journey/Refresher";
import JourneyStateIndicator from "./journey/JourneyStateIndicator";
import type { API_SchedulePoint, Departure, Stop } from "@/lib/departuresStruct";
import { getJourneys } from "@/lib/fetchJourneys.ts";
import type { SidebarEventConsumer } from "@/lib/sidebarEvents/sidebarEventConsumer";
import SidebarShowLineEvent from "@/lib/sidebarEvents/sidebarShowLineEvent";
import { Data } from "@/lib/innerDatabase";
import getTimetable from "@/lib/journey/getTimetable";
import JourneyOverview from "@/components/sidebar/journey/JourneyOverview";
import type SidebarEvent from "@/lib/sidebarEvent";
import { getLiveStops } from "@/lib/getLiveStops";
import combineTimetableLive from "@/lib/journey/combineTimetableLive";

export default function JourneySidebar(
	{ hideFunc, actionFunc, onEvent = () => { }, departure }:
		{
			hideFunc: React.MouseEventHandler,
			actionFunc: React.MouseEventHandler,
			onEvent?: SidebarEventConsumer,
			departure: Departure
		}) {
	const activationId = `${departure.activationId}`;
	const scheduleId = `${departure.scheduleId}`;
	const cancelledTimestamp = departure.cancelledTimestamp;
	const trainUid = departure.trainUid;

	const [Stops, setStops] = useState<Stop[] | null>(null);

	type VisiblePanelEnum = "overview" | "timetable"
	const [VisiblePanel, setVisiblePanel] = useState<VisiblePanelEnum>("overview");
	function DrawVisiblePanel() {
		// Early exit- if the data is not loaded, break
		if (!Stops) return <div className=""><Spinner /></div>;

		// Return different output panels depending on VisiblePanel choice.
		switch (VisiblePanel) {
			case "timetable":
				return <TimetableView Stops={Stops} onEvent={HandleEvent} />;
			case "overview":
			default:
				return <JourneyOverview Stops={Stops} />;
		}
	}

	type LatLongPoints = { lat: number, long: number }[];

	/**
	 * Collects line data for use by overarching line calls.
	 */
	async function CollectLineData(schedPoint: API_SchedulePoint[]): Promise<LatLongPoints> {
		const latlongpoints: LatLongPoints = [];

		// Yes, this loop is needed, because you can't lock (await) within arr.forEach
		for (let i = 0; i < schedPoint.length; i++) {
			const v = schedPoint[i];

			// Latlong from the request is not in the same syntax as the internal data, causing it to mismatch.
			// As a result, this is commented out- see for yourself how it looks when enabled.
			//if (v.latLong) { latlongpoints.push({ lat: v.latLong.latitude, long: v.latLong.longitude }); continue; }

			// Points without a latLong are checked for their latLong from the local data.
			const localtiploc = await Data.GetTiploc(v.tiploc);
			if (localtiploc) { latlongpoints.push({ lat: localtiploc.Latitude, long: localtiploc.Longitude }); continue; }
			// Points that do not exist are not pushed.
		}
		return latlongpoints;
	}

	function GetData() {
		setStops(null);
		let staticstops: Stop[];
		getTimetable(activationId, scheduleId).then(stops => {
			setStops(stops);
			staticstops = stops;
			return getLiveStops(activationId, scheduleId);
		}).then(stops => {
			setStops(combineTimetableLive(staticstops, stops));
		});

		onEvent(new SidebarShowLineEvent(null));
		getJourneys(activationId, scheduleId).then(j => {
			CollectLineData(j).then(p => onEvent(new SidebarShowLineEvent(p)));
		})
	}

	const refreshData = useEffectEvent(GetData);

	useEffect(() => refreshData(), [activationId, scheduleId])

	function HandleEvent(e: SidebarEvent) {
		onEvent(e);
	}

	return (
		<div className='
		min-w-md bg-muted pointer-events-auto
        flex flex-col max-h-full rounded-r-sm overflow-hidden min-h-[90%]
		'>
			<header className='z-10 bg-muted rounded-tr-lg'>
				<div className='
				p-4 flex flex-row w-full place-content-between place-items-center 
				bg-primary text-primary-foreground rounded-tr-lg
				'>
					<SidebarHeaderActionButton clickHandler={actionFunc}>
						<Undo2 className="size-8" />
					</SidebarHeaderActionButton>
					<h1 className='h1 fit-content'>Journey</h1>
					<Button size="fit" variant="ghost" className="p-1.25" onClick={hideFunc}>
						<Minimize2 className='size-8' />
					</Button>
				</div>
			</header>
			<article className="flex flex-col overflow-hidden h-full min-h-full">
				<header className="flex flex-col p-4 gap-4 border-b border-black/15">
					<div className="flex flex-row place-content-between items-center">
						<span className="flex flex-row gap-3 items-center">
							<TrainFront className="size-8" />
							<h1 className="h1">{trainUid}</h1>
						</span>
						{
							Stops ? <JourneyStateIndicator subject={Stops} cancelled={departure.isCancelled} />
								: null
						}
					</div>
					<Tabs value={VisiblePanel} onValueChange={(v) => setVisiblePanel(v as VisiblePanelEnum)}>
						<TabsList variant="line">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="timetable">Timetable</TabsTrigger>
						</TabsList>
					</Tabs>
				</header>
				<article className="overflow-auto h-full">
					{DrawVisiblePanel()}
				</article>
				{
					// Uncancelled journeys may be refreshed interactively.
					!cancelledTimestamp ? <Refresher onRefresh={() => GetData()} />
						// Cancelled ones do not need to be.
						: (
							<footer className="
						flex flex-row place-items-center justify-center
						border-t border-black/15 text-red/45
						p-1 gap-1
						">
								<AlertCircle />
								<span>Cancelled since {cancelledTimestamp}</span>
							</footer>
						)
				}
			</article>
		</div>
	)
}
