import type { Stop } from "../departuresStruct";
import { getJourneys } from "../fetchJourneys";

/**
 * Fetch the timetable for a specific journey
 * @param {string} activationId - the specific Activation ID associated with the specific journey
 * @param {string} scheduleId - the specific Schedule ID associated with the specific journey
 * @return {Promise<Stop[]>} - an array of stops found in the specific journey's timetable
 * */
export default async function getTimetable(activationId: string, scheduleId: string): Promise<Stop[]> {
	return getJourneys(activationId, scheduleId).then((v) => {
		const base: Stop[] = [];
		v.forEach((i) => {
			let formattedSchedule: string;
			if (typeof i.departure == "string") {
				formattedSchedule = scheduleTimeSplit(i.departure);
			} else if (typeof i.pass == "string") {
				formattedSchedule = scheduleTimeSplit(i.pass);
			} else if (typeof i.arrival == "string") {
				formattedSchedule = scheduleTimeSplit(i.arrival);
			} else {
				formattedSchedule = "00:00";
			}

			const newStop: Stop = {
				Tiploc: i.tiploc,
				Name: i.location,
				ScheduledTime: formattedSchedule,
				isLate: false,
				Passed: false,
				isEarly: false
			};

			base.push(newStop);
		});
		return base;
	});
}

/**
 * Formats the time to look nice to the user
 * @param {string} time - The time string to format
 * @return {string} The formatted time string
 * */
function scheduleTimeSplit(time: string): string {
	return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
}