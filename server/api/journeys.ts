import { defineHandler } from "nitro";
import { fetchRawDepartures } from "./railAPI";
import { processJourneyData } from "@/lib/railAPIHandler";

/** Fetch departures endpoint */
export default defineHandler(async (event) => {
  const tiploc = event.req.headers.get("tiploc")
  if (!tiploc) return Promise.reject("No tiploc specified.")

  return fetchRawDepartures(tiploc).then(data => JSON.stringify(processJourneyData(data, tiploc)),
    reason => Promise.reject(reason))
})
