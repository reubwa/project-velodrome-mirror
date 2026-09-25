import {getMovements} from "@/lib/fetchMovement.ts";
import type {Stop} from "@/lib/departuresStruct.ts";
import {dateformat} from "@/lib/dateFormat.ts";

/**
 * Fetch the live timetable for a specific journey
 * @param {string} activationId - the specific Activation ID associated with the specific journey
 * @param {string} scheduleId - the specific Schedule ID associated with the specific journey
 * @return {Promise<Stop[]>} - an array of stops found in the specific journey's timetable
 * */
export async function getLiveStops(activationId: string, scheduleId: string): Promise<Stop[]> {
    const base: Stop[] = [];
    const v = await getMovements(activationId, scheduleId);
    v.forEach((i) => {
        const thisActualDate = i.eventType === "DESTINATION" || i.eventType === "ARRIVAL" ? i.actualArrival : i.actualDeparture;
        const thisPlannedDate = i.eventType === "DESTINATION" || i.eventType === "ARRIVAL" ? i.plannedArrival : i.plannedDeparture;

        const actualTime = new Date(thisActualDate).getTime();
        const plannedTime = new Date(thisPlannedDate).getTime();

        // Calculate the difference in minutes
        const diffMinutes = Math.round((actualTime - plannedTime) / 60000);

        let descriptor = "On time";
        if (diffMinutes > 0) {
            descriptor = `${diffMinutes} min late`;
        } else if (diffMinutes < 0) {
            descriptor = `${Math.abs(diffMinutes)} min early`;
        }

        const newStop: Stop = {
			Tiploc: "",
            Name: i.location,
            ScheduledTime: dateformat(new Date(thisPlannedDate)),
            actualTime: dateformat(new Date(thisActualDate)),
            isLate: actualTime > plannedTime,
            isEarly: actualTime < plannedTime,
            Passed: new Date(Date.now()).getTime() > actualTime,
            LatenessOrEarlinessDescriptor: descriptor
        };
        base.push(newStop);
    });
    return base;
}