import { cn } from "@/lib/utils";

export default function TimetableLineSegment( { startEnd, isCurrent, isDisabled } : { startEnd : number, isCurrent : boolean, isDisabled : boolean } ) {
	let classes = "";
	let src = "";
	let alt = "Timetable Current Icon";
	switch (Math.sign(startEnd)) {
		case -1:
			src = isCurrent ? "timetable/end_current.svg" : "timetable/end.svg";
			alt = isCurrent ? "Timetable Current Icon" : "Timetable End Icon";
			break;
		case 1:
			src = isCurrent ? "timetable/start_current.svg" : "timetable/start.svg";
			alt = isCurrent ? "Timetable Current Icon" : "Timetable Start Icon";
			break;
		case 0:
		default:
			src = isCurrent ? "timetable/line_current.svg" : "timetable/line.svg";
			alt = isCurrent ? "Timetable Current Icon" : "Timetable Line Icon";
			break;
	}
	// semi-transparent the icon if it is disabled
	classes = cn(classes, (isDisabled && !isCurrent) ? "opacity-50" : "");

	return <img src={src} alt={alt} className={classes} />
}