/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Funnel, LocateFixed, TrainFront, Undo2, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sidebar } from "./Sidebar";
import { SidebarHeaderActionButton } from "./SidebarHeaderActionButton";
import type { TiplocData } from "@/lib/tiplocLoader";
import { cn } from "@/lib/utils";
import XorHash from "@/lib/xorhash";

/**
 * Color scheme for randomised colours for tags and enums.
 * 
 * Randomly generated using iwanthue web application.
 * src: https://medialab.github.io/iwanthue/
 */
const randocol = [
	"#e9b0b5",
	"#56cfd6",
	"#eda4c1",
	"#a2cb92",
	"#74aff3",
	"#eadca5",
	"#69cced",
	"#eab494",
	"#98cdf1",
	"#c3bf90",
	"#dcb4e5",
	"#d0f0c0",
	"#acbae8",
	"#9ad3b3",
	"#9beee7",
	"#8accc3"
];

/**
 * Collect random color. Consistent for matching values.
 */
function getRandoCol(value: string): string {
	return randocol[XorHash(value) % randocol.length];
}

/**
 * Draw one row of table data for this TIPLOC. 
 */
function TiplocExtDataTableRow({ title, data = null, onFilter = null }: { title: string, data?: any, onFilter?: React.MouseEventHandler | null }) {
	return (
		<tr className={cn("table-row", data ? "" : " font-lg text-primary/20")}>
			<td className={cn("table-cell font-bold! text-right", data ? "" : "line-through")}>{title}</td>
			<td className="table-cell font-medium! ">
				{data ?? "None"}
				{(data && onFilter) ? (
					<Button size="fit" variant="dotbutton" title="Filter by this attribute">
						<Funnel />
					</Button>
				) : null}
			</td>
		</tr>
	)
}

/**
 * Show boolean value in badge format.
 */
function TiplocBoolBadge({ title, flag = false }: { title: string, flag?: boolean }) {
	return (
		<Badge variant={flag ? "default" : "outline"} className="p-3 gap-2">
			{flag ? (<Check className="size-4" />) : (<X className="size-4" />)}
			{title}
		</Badge>
	)
}

/**
 * Show some value as a badge (alike to a tag or "pill" display).
 */
function TiplocCodeBadge({ value }: { value: string }) {
	const selected = {
		background: getRandoCol(value)
	}

	return (
		<Badge variant="default" className="p-3 gap-2" style={selected}>
			{value}
		</Badge>
	)
}

/**
 * Show some value as a larger badge (alike to a "card" display).
 */
function TiplocEnumBadge({ title, value = null }: { title: string, value: string | null }) {
	if (!value) return null;

	const selected = {
		borderLeftColor: getRandoCol(value)
	}

	return (
		<div className="
		ring-foreground/10 ring-1 bg-card rounded-lg text-card-foreground
		flex flex-col p-2 gap-2 px-4 border-l-8
		" style={selected}>
			<p className="typo-subtle">{title}</p>
			<p className="text-xl! font-bold!">{value}</p>
		</div>
	)
}


export function TiplocSidebar(
	{ hideFunc, Tiploc, actionFunc, onLocateTIPLOC, backAction = null }:
		{
			hideFunc: React.MouseEventHandler;
			Tiploc: TiplocData;
			actionFunc: React.MouseEventHandler;
			onLocateTIPLOC: React.MouseEventHandler;
			backAction?: React.MouseEventHandler | null;
		}
) {
	return (
		<Sidebar
			title="TIPLOC info" hideFunc={hideFunc}
			actionButton={backAction ? (
				<SidebarHeaderActionButton clickHandler={backAction}><Undo2 className="size-8" /></SidebarHeaderActionButton>
			) : ""
			}
		>
			<div className="flex flex-row w-full place-content-between">
				<div className="flex flex-col">
					<h2 className="h2 font-bold!">{Tiploc.Tiploc}</h2>
					<p className="text-lg">{Tiploc.Name}</p>
				</div>
				<div className="flex flex-row gap-2">
					<Button className="p-2" size="fit" variant="outline" title="View Departure data" onClick={actionFunc}>
						<TrainFront className="size-8" />
					</Button>
					<Button className="p-2" size="fit" variant="outline" title="Show this TIPLOC on map" onClick={onLocateTIPLOC}>
						<LocateFixed className="size-8" />
					</Button>
				</div>
			</div>

			<table className="table table-fixed border-separate border-spacing-x-4">
				<tbody>
					<TiplocExtDataTableRow title="CRS" data={Tiploc.Details.CRS} />
					<TiplocExtDataTableRow title="Nalco" data={Tiploc.Details.Nalco} />
					<TiplocExtDataTableRow title="UIC" data={Tiploc.Details.UIC} />
					<TiplocExtDataTableRow title="Zone" data={Tiploc.Details.Zone} />
					<TiplocExtDataTableRow title="Stanox" data={Tiploc.Stanox} />
				</tbody>
			</table>

			<div className="flex flex-row flex-wrap gap-3 max-w-100">
				<TiplocBoolBadge title="In BPlan" flag={Tiploc.InBPlan} />
				<TiplocBoolBadge title="In TPS" flag={Tiploc.InTPS} />
				<TiplocBoolBadge title="Is Tiploc" flag={Tiploc.IsTiploc} />
				<TiplocBoolBadge title="Off Network" flag={Tiploc.Details.OffNetwork} />
				<TiplocBoolBadge title="Compulsory Stop" flag={Tiploc.Details.CompulsoryStop} />
				{Tiploc.Codes.map(v => <TiplocCodeBadge value={v} key={v} />)}
			</div>

			<TiplocEnumBadge title="BPlan Timing Point" value={Tiploc.Details.BPlan_TimingPoint} />
			<TiplocEnumBadge title="TPS Station Type" value={Tiploc.Details.TPS_StationType} />
			<TiplocEnumBadge title="TPS Station Category" value={Tiploc.Details.TPS_StationCategory} />
			<TiplocEnumBadge title="Force LPB" value={Tiploc.Details.ForceLPB} />
		</Sidebar>
	);
}