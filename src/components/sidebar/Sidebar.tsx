import * as React from "react";

import { Minimize2, SquareMousePointer } from 'lucide-react';
import { useEffect, useState } from "react";
import { Button } from '../ui/button';
import { TiplocSidebar } from "./TiplocSidebar";
import JourneySidebar from "./JourneySidebar";
import { DeparturesSidebar } from "./DeparturesSidebar";
import { NotSelectedSidebar } from "./NotSelectedSidebar";
import { SidebarSwitch } from "./sidebarSwitch";
import { type TiplocData } from "@/lib/tiplocLoader";
import { processStationDepartures } from "@/lib/railAPIHandler";
import type { API_Departure, Departure } from "@/lib/departuresStruct";
import SidebarLocateTiplocEvent from "@/lib/sidebarEvents/sidebarLocateTiplocEvent";
//import SidebarShowLineEvent from "@/lib/sidebarEvent/sidebarShowLineEvent";
import type { SidebarEventConsumer } from "@/lib/sidebarEvents/sidebarEventConsumer";
import type SidebarEvent from "@/lib/sidebarEvent";
import SidebarHideSelf from "@/lib/sidebarEvents/sidebarHideSelf";
import SidebarShowLineEvent from "@/lib/sidebarEvents/sidebarShowLineEvent";

interface SidebarProps {
	title: string;
	hideFunc: React.MouseEventHandler;
	children: React.ReactNode;
	actionButton?: React.ReactNode | null;
}

export interface SidebarLoadState {
	status: "loading" | "loaded" | "error";
	errorMsg: string;
}

export function Sidebar({ title, hideFunc, children, actionButton = null }: SidebarProps) {
	return (
		<div className='min-w-md bg-muted pointer-events-auto
					flex flex-col max-h-[90%] rounded-r-sm overflow-hidden bg-clip min-h-[90%]'>
			<div className='top-0 z-10 bg-muted pb-2'>
				<div className='p-4 flex flex-row w-full place-content-between place-items-center bg-primary text-primary-foreground gap-2.5'>
					<div className="flex flex-row gap-4">
						{actionButton}
					</div>
					<h1 className='h1 fit-content'>{title}</h1>
					<Button size="fit" variant="ghost" className="p-2" onClick={hideFunc}>
						<Minimize2 className='size-8' />
					</Button>
				</div>
			</div>
			<div className='p-4 pt-2 flex flex-col gap-4 overflow-y-auto rounded-br-lg'>
				{children}
			</div>
		</div>
	);
}

export function WrappedLeftSidebar({ tiploc, onEvent = () => { } }: { tiploc: TiplocData | null, onEvent?: SidebarEventConsumer }) {
	const [ShowSidebar, setShowSidebar] = useState(false);
	const [sidebarSwitch, setSidebarSwitch] = useState<SidebarSwitch>(SidebarSwitch.Tiploc);
	const [Departures, setDepartures] = useState<Departure[]>([]);
	const [SelectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
	const [departureLoadState, setDepartureLoadState] = useState<SidebarLoadState>({ status: "loading", errorMsg: "" });

	// When redrawing panel, send event to hide drawn lines.
	//onEvent(new SidebarShowLineEvent(null));

	function refreshTrainData() {
		if (!tiploc) return;

		setDepartureLoadState({ status: "loading", errorMsg: "" });
		fetch(`/api/raw-departures`, { headers: { Tiploc: tiploc.Tiploc, Accept: "application/json" } }).then(response => {
			if (!response.ok) {
				const reasonText = `Error ${response.status}${response.statusText ? ` - ${response.statusText}` : ""}`
				return Promise.reject(`Could not get response from train API. ${reasonText}`)
			}

			return response.json()
		}, (reason: Response) => {
			const reasonText = `Error ${reason.status}${reason.statusText ? ` - ${reason.statusText}` : ""}`
			return Promise.reject(`Could not get response from map server. ${reasonText}`)
		})
			.then((data: API_Departure[]) => {
				setDepartures([...processStationDepartures(data, tiploc.Tiploc)]);
				setDepartureLoadState({ ...departureLoadState, status: "loaded" });
			}, (reason: string) => {
				setDepartureLoadState({ status: "error", errorMsg: reason });
			})
	}

	const onTiplocChange = React.useEffectEvent((tiploc: TiplocData | null) => {
		if (!tiploc) {
			setSidebarSwitch(SidebarSwitch.NotSelected);
		} else {
			if (!ShowSidebar) setShowSidebar(true);

			switch (sidebarSwitch) {
				case SidebarSwitch.Departures:
					refreshTrainData();
					break;
				default:
					setSidebarSwitch(SidebarSwitch.Tiploc);
					break;
			}
		}
	})

	useEffect(() => {
		onTiplocChange(tiploc);
	}, [tiploc]);

	useEffect(() => onEvent(new SidebarShowLineEvent(null)),
		// DO NOT HEED ESLINT'S ADVICE, ADDING ONEVENT CAUSES AN INFLOOP AT RUNTIME
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[sidebarSwitch])

	function HandleEvent(event: SidebarEvent) {
		if (event instanceof SidebarHideSelf) {
			setShowSidebar(false);
		}
		onEvent(event);
	}

	function SidebarHidden() {
		return (
			<Button className='pointer-events-auto rounded-1-sm rounded-r-sm' size="fit" variant="overmap" onClick={() => {
				if (sidebarSwitch === SidebarSwitch.Departures) refreshTrainData();
				setShowSidebar(true)
			}}>
				<SquareMousePointer className='size-8' />
			</Button>
		);
	}

	function SidebarVisible() {
		switch (sidebarSwitch) {
			case SidebarSwitch.Tiploc:
				if (!tiploc) return (<NotSelectedSidebar hideFunc={() => setShowSidebar(false)} />);
				return (<TiplocSidebar onLocateTIPLOC={() => onEvent(new SidebarLocateTiplocEvent(tiploc.Tiploc))} hideFunc={() => setShowSidebar(false)} Tiploc={tiploc} actionFunc={() => {
					refreshTrainData();
					setSidebarSwitch(SidebarSwitch.Departures);
				}} />);
			case SidebarSwitch.Departures:
				return (<DeparturesSidebar departuresList={Departures} loadState={departureLoadState}
					actionFunc={() => setSidebarSwitch(SidebarSwitch.Tiploc)}
					cardClickHandler={() => {
						setSidebarSwitch(SidebarSwitch.Journey);
					}}
					departurePass={(departure) => setSelectedDeparture(departure)}
					onEvent={HandleEvent}
				/>)
			case SidebarSwitch.Journey:
				return SelectedDeparture ? <JourneySidebar 
				hideFunc={() => setShowSidebar(false)} 
				actionFunc={() => setSidebarSwitch(SidebarSwitch.Departures)} 
				onEvent={HandleEvent}
				departure={SelectedDeparture}
				/>
				: null;
			case SidebarSwitch.NotSelected:
			default:
				return (<NotSelectedSidebar hideFunc={() => setShowSidebar(false)} />);
		}
	}

	return ShowSidebar ? SidebarVisible() : SidebarHidden();
}