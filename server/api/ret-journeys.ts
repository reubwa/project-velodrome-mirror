import { defineHandler } from "nitro";
import { fetchRawJourney } from "./fetchJourney";

/**Endpoint for fetching timetabled journey information*/
export default defineHandler(async (event) => {
    const activationId = event.req.headers.get("ActivationId");
    const scheduleId = event.req.headers.get("ScheduleId");
    if (!activationId || !scheduleId) return Promise.reject("No Activation ID or Schedule ID specified.");

    return fetchRawJourney(activationId, scheduleId).then(
		data => JSON.stringify(data),
        reason => Promise.reject(reason)
	);
})