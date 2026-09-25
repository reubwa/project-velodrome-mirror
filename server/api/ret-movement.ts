import { defineHandler } from "nitro";
import { fetchRawMovement } from "./fetchJourney";

/**Endpoint for fetching live journey information*/
export default defineHandler(async (event) => {
    const activationId = event.req.headers.get("ActivationId");
    const scheduleId = event.req.headers.get("ScheduleId");
    if (!activationId || !scheduleId) return Promise.reject("No Activation ID or Schedule ID specified.");

    return fetchRawMovement(activationId, scheduleId).then(
        data => JSON.stringify(data),
        reason => Promise.reject(reason)
    );
})