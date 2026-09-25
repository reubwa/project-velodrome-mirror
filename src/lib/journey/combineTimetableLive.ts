import type { Stop } from "../departuresStruct";

/**
 * Cleverly combines the scheduled and live timetable for a specific journey
 * 
 * @param {string} activationId - the specific Activation ID associated with the specific journey
 * @param {string} scheduleId - the specific Schedule ID associated with the specific journey
 * @return {Promise<Stop[]>} - an array of stops found in the specific journey's timetable
 * */
export default function combineTimetableLive(staticTimetable : Stop[], liveTimetable : Stop[]) : Stop[] {
    // Perform a "left join" (SQL like) where all fields that are null on the left table (staticTimetable) 
	// will be filled by the right (liveTimetable) where they are available.
	// This works as we can assume that staticTimetable's data is complete, while liveTimetable's is not.
	// They are key matched by the field "Name".
	const combinedArray = staticTimetable.map(v => {
		const o = v;
		const live = liveTimetable.find(w => (w.Name == v.Name));
		if (live) {
			// If there is data to join, replace the null/placeholder fields from the static source.
			o.ScheduledTime = live.ScheduledTime;
			o.actualTime = live.actualTime;
			o.isLate = live.isLate;
			o.isEarly = live.isEarly;
			o.Passed = live.Passed;
			o.LatenessOrEarlinessDescriptor = live.LatenessOrEarlinessDescriptor;
		}
		return o;
	});

	/*
	Some stops are not represented in live data. Because of this, there may be inconsistencies in showing whether a train has actually passed a stop or not.
	However, it is reasonable to assume that if a stop later in the day has been passed that all prior stops must have been passed as well.
	*/
	let shouldHavePassed = false;
	for (let i = combinedArray.length - 1; i >= 0; i--) {
		if (!shouldHavePassed && combinedArray[i].Passed) {
			shouldHavePassed = true;
		} else if (shouldHavePassed && !combinedArray[i].Passed) {
			combinedArray[i].Passed = true;
		}
	}

	return combinedArray;
}