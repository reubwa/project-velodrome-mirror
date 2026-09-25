import { defineHandler } from "nitro";
import { fetchRawDepartures } from "./railAPI"

/**Endpoint for fetching departures*/
export default defineHandler(async (event) => {
  const tiploc = event.req.headers.get("Tiploc")
  if (!tiploc) return Promise.reject("No tiploc specified.");

  return fetchRawDepartures(tiploc).then(data => JSON.stringify(data),
    reason => Promise.reject(reason))
})