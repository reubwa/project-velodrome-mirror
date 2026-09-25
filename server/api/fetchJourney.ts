import {getAPIFetchHeaders} from "./railAPI";
import {type API_SchedulePoint, type API_TrainMovement} from "@/lib/departuresStruct";

/**
 * Fetch data from the first extended API (timetable data)
 *
 * Both parameters are associated with a departure
 * @param {string} activationID - The Activation ID to search for
 * @param {string} scheduleID - The Schedule ID to search for
 * @return {Promise<API_SchedulePoint[]>} an array of points in the timetable
 * */
export async function fetchRawJourney(activationID: string, scheduleID: string){
    // Get API headers. Immediately reject if there's no API key.
    let headers: Headers;
    try {
        headers = getAPIFetchHeaders();
    } catch (err) {
        if (err instanceof ReferenceError) return Promise.reject(new Response(err.message, {status: 401, statusText: err.message}));
        return Promise.reject(new Response(null, {status: 400}));
    }

    const journeyResponse = fetch(`https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/${activationID}/${scheduleID}`, {
        headers: headers
    });

    const journeyData: Promise<API_SchedulePoint[]> = journeyResponse.then((response) => {
        if (!response.ok) { // If something went wrong on Velociti's end or API key expires, reject data
            return Promise.reject(response);
        }

        return response.json();
    }, () => { // If there is no connection or there is some grievous error in the fetch(), return a 500 response
        return Promise.reject(new Response(null, {status: 500}));
    })

    return journeyData;
}

/**
 * Fetch data from the second extended API (live journey data)
 *
 * Both parameters are associated with a departure
 * @param {string} activationID - The Activation ID to search for
 * @param {string} scheduleID - The Schedule ID to search for
 * @return {Promise<API_TrainMovement[]>} an array of points in the live timetable
 * */
export async function fetchRawMovement(activationID: string, scheduleID: string){
    // Get API headers. Immediately reject if there's no API key.
    let headers: Headers;
    try {
        headers = getAPIFetchHeaders();
    } catch (err) {
        if (err instanceof ReferenceError) return Promise.reject(new Response(err.message, {status: 401, statusText: err.message}));
        return Promise.reject(new Response(null, {status: 400}));
    }

    const journeyResponse = fetch(`https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/${activationID}/${scheduleID}`, {
        headers: headers
    });

    const journeyData: Promise<API_TrainMovement[]> = journeyResponse.then((response) => {
        if (!response.ok) { // If something went wrong on Velociti's end or API key expires, reject data
            return Promise.reject(response);
        }
        return response.json();
    }, () => { // If there is no connection or there is some grievous error in the fetch(), return a 500 response
        return Promise.reject(new Response(null, {status: 500}));
    })

    return journeyData;
}