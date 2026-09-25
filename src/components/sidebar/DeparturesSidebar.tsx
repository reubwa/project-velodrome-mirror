import { RouteOff, Undo2 } from "lucide-react";
import { FieldGroup } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { Sidebar, type SidebarLoadState } from "./Sidebar";
import { SidebarHeaderActionButton } from "./SidebarHeaderActionButton";
import DeparturesCard from "./DeparturesCard";
import type { Departure } from "@/lib/departuresStruct";
import type { SidebarEventConsumer } from "@/lib/sidebarEvents/sidebarEventConsumer";
import SidebarHideSelf from "@/lib/sidebarEvents/sidebarHideSelf";

// Placeholder for no departures returned from API query
function NoDeparturesAvailable() {
	return (
		<div className="flex items-center flex-col pt-30 gap-5">
			<RouteOff className="size-30" color="#9ca3af" />
			<h2 className="h2 text-gray-400">No Departures from this Tiploc</h2>
		</div>
	);
}

function DeparturesSidebar(
	{ onEvent, departuresList, actionFunc, departurePass, cardClickHandler, loadState }:
		{
			onEvent: SidebarEventConsumer;
			departuresList: Departure[];
			actionFunc: React.MouseEventHandler;
			departurePass(depart: Departure): void;
			cardClickHandler: React.MouseEventHandler;
			loadState: SidebarLoadState;
		}
) {
	// Display list of departures
	function DepartureDisplay() {
		return departuresList.length > 0 ? (
			<>
				{departuresList.map((el, index) => {
					return (<DeparturesCard key={index} departure={el} clickHandler={(event) => {
						departurePass(el);
						cardClickHandler(event);
					}} disable={loadState.status === "loading"} />);
				})}
				<hr className="hr" />
				<p className="typo-subtle text-center">{departuresList.length} total departures</p>
			</>
		) : <NoDeparturesAvailable />;
	}

	// Internal switching function to change which of the three types of departure panel show at one time
	function innerSwitch() {
		switch (loadState.status) {
			case "loading":
				return departuresList.length > 0 ? (
					<>
						<Spinner />
						<DepartureDisplay />
					</>)
					: (
						<div className='flex items-center flex-col pt-30 gap-5'>
							<Spinner /> <h3 className='h2 text-gray-400'>Loading...</h3>
						</div>
					)
			case "loaded":
				return (<DepartureDisplay />)
			case "error":
			default:
				return (
					<div className='flex items-center flex-col gap-4'>
						<h3 className='h3 fit-content text-red-600'>Error loading data!</h3>
						<p>{loadState.errorMsg}</p>
					</div>
				)
		}
	}

	// Return inner component.
	return (
		<Sidebar title="Departures" hideFunc={() => onEvent(new SidebarHideSelf())} actionButton={(
			<SidebarHeaderActionButton clickHandler={actionFunc}>
				<Undo2 className="size-8" />
			</SidebarHeaderActionButton>
		)}>
			<FieldGroup className='w-full'>
				{innerSwitch()}
			</FieldGroup>
		</Sidebar>
	);
}

export default DeparturesSidebar;
export { DeparturesSidebar };