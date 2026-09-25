import type {API_TrainMovement} from "@/lib/departuresStruct.ts";

/**
 * Fetch the live information for a specific journey
 * @param {string} ActivationId - the specific Activation ID associated with the specific journey
 * @param {string} ScheduleId - the specific Schedule ID associated with the specific journey
 * @return {Promise<API_TrainMovement[]>} - an array of stops found in the specific journey's timetable (but processing will be required)
 * */
export async function getMovements(ActivationId: string, ScheduleId: string) : Promise<API_TrainMovement[]> {
    const resp : Promise<API_TrainMovement[]> = fetch('/api/ret-movement',{headers:{ActivationId: ActivationId, ScheduleId: ScheduleId, Accept: "application/json"}}).then(response => {
        if (!response.ok) {
            const reasonText = `Error ${response.status}${response.statusText ? ` - ${response.statusText}` : ""}`
            return Promise.reject(`Could not get response from train API. ${reasonText}`)
        }
        return response.json();
    },(reason : Response) => {
        const reasonText = `Error ${reason.status}${reason.statusText ? ` - ${reason.statusText}` : ""}`
        return Promise.reject(`Could not get response from map server. ${reasonText}`)
    });

    if (import.meta.env.DEV) {
        resp.then(v => {
            console.debug(`Live movement collected. ${v.length} entries.`);
            return v;
        }, (reason: string) => {
            console.error(reason);
        });
    }

    return resp;
}