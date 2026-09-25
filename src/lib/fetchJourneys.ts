import type { API_SchedulePoint } from "@/lib/departuresStruct.ts";

/**
 * Fetch the timetable for a specific journey
 * @param {string} ActivationId - the specific Activation ID associated with the specific journey
 * @param {string} ScheduleId - the specific Schedule ID associated with the specific journey
 * @return {Promise<API_SchedulePoint[]>} - an array of stops found in the specific journey's timetable (but processing will be required)
 * */
export async function getJourneys(ActivationId: string, ScheduleId: string) : Promise<API_SchedulePoint[]> {
	const resp : Promise<API_SchedulePoint[]> = fetch(`/api/ret-journeys`, { headers: { ActivationId: ActivationId, ScheduleId: ScheduleId, Accept: "application/json" } }).then(response => {
		if (!response.ok) {
			const reasonText = `Error ${response.status}${response.statusText ? ` - ${response.statusText}` : ""}`
			return Promise.reject(`Could not get response from train API. ${reasonText}`)
		}

		return response.json();
	}, (reason: Response) => {
		const reasonText = `Error ${reason.status}${reason.statusText ? ` - ${reason.statusText}` : ""}`
		return Promise.reject(`Could not get response from map server. ${reasonText}`)
	});

	if (import.meta.env.DEV) {
		resp.then(v => {
			console.debug(`Train timetable fetched. ${v.length} entries.`);
			return v;
		}, (reason: string) => {
			console.error(reason);
		});
	}

	return resp;
}