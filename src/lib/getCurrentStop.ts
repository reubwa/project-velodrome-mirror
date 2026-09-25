import type {Stop} from "@/lib/departuresStruct.ts";

/**
 * Finds the current stop by iterating through an array to find the last stop marked as passed (the next stop is then marked as the current stop)
 * @param {Stop[]} array - the array of stops to iterate through
 * @return {Stop} - the current stop (if none are marked as passed, the train hasn't departed yet so the first stop)
 * */
export function getCurrentStop(array: Stop[]): Stop {
    if (array.length === 0) {
        throw new Error("Cannot get current stop from an empty array.");
    }

    // Iterate backwards to find the most recently passed stop.
    // The moment we find a stop that has passed, we return it.
    for (let i = array.length - 1; i >= 0; i--) {
        // Check if it is the last item in the array to prevent index out of bounds on array[i+1]
        if (array[i].Passed && (i === array.length - 1 || !array[i+1].Passed)) {
            return array[i];
        }
    }

    // If the loop finishes and no stops have 'Passed' set to true,
    // the train hasn't departed yet. We return the first stop (origin).
    return array[0];
}