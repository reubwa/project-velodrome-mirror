import type {Stop} from "@/lib/departuresStruct.ts";

/**
 * Check if a journey is in the past
 * @param {Stop[]} Stops - the journey to check
 * @return {boolean} - true or false
 * */
export function hasJourneyHappened(Stops:Stop[]): boolean{
    return new Date(Date.now()).getTime() < new Date(Stops[0].ScheduledTime).getTime();
}