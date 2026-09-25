import type { Stop } from "../departuresStruct";

/**
 * Performs logical comparisons on a train's timetable with joined live data to assume the train's current state.
 * 
 * @returns One of four states this train is in.
 */
export default function InterpretLiveTimetable(subject : Stop[], cancelled : boolean) : "notStarted" | "inProgress" | "cancelled" | "completed" {
    // Yes, it is silly to pass cancelled in just to return a unique string result.
    if (cancelled) return "cancelled";
	if (subject[subject.length-1].actualTime) return "completed";
    if (!subject[0].actualTime) return "notStarted";
    return "inProgress"; 
}