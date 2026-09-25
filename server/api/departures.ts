import { defineHandler } from "nitro";
import { fetchRawDepartures } from "./railAPI";
import { processStationDepartures } from "@/lib/railAPIHandler";

export default defineHandler(async (event) => {
  const tiploc = event.req.headers.get("tiploc")
  if (!tiploc) return Promise.reject("No tiploc specified.")

  return fetchRawDepartures(tiploc).then(data => JSON.stringify(processStationDepartures(data, tiploc)),
    reason => Promise.reject(reason))
})