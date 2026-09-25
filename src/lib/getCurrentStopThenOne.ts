import type {Stop} from "@/lib/departuresStruct.ts";
import {getCurrentStop} from "@/lib/getCurrentStop.ts";


/**
 * Finds the current stop by iterating through an array to find the last stop marked as passed (the next stop is then marked as the current stop)
 * Wrapper for getCurrentStop in order to account for SVG funkiness
 * @deprecated - awaiting Conor's improvements to SVGs
 * @param {Stop[]} array - the array of stops to iterate through
 * @return {Stop} - the current stop (if none are marked as passed, the train hasn't departed yet so the first stop)
 * */
export function getCurrentStopThenOne(array: Stop[]): Stop {
    const res = getCurrentStop(array);
    if(res === array[0])return array[0];
    return array[array.indexOf(res)+1];
}