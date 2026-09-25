/* eslint-disable react-hooks/rules-of-hooks */
// There will never be any React here. This is to fix ESLint getting confused

import { useRuntimeConfig } from "nitro/runtime-config";
import type { API_Departure } from "@/lib/departuresStruct";

/**Get the necessary headers required for API requests*/
export function getAPIFetchHeaders(): Headers {
  const fetchHeaders = new Headers();

  // Add API key "NITRO_API_KEY = " to /.env.local file and to your deployment in order to get responses
  if (!useRuntimeConfig().apiKey) throw new ReferenceError("No API key found to request data!");
  fetchHeaders.set("X-ApiKey", useRuntimeConfig().apiKey);
  fetchHeaders.set("Connection", "keep-alive");
  fetchHeaders.set("Accept", "application/json");

  return fetchHeaders;
}

/**
 * Fetch departures
 * @param {string} tiplocID - The Tiploc to search for associated departures
 * */
export async function fetchRawDepartures(tiplocID: string): Promise<API_Departure[]> {
  // Get API headers. Immediately reject if there's no API key.
  let headers: Headers;
  try {
    headers = getAPIFetchHeaders();
  } catch (err) {
    if (err instanceof ReferenceError) return Promise.reject(new Response(err.message, {status: 401, statusText: err.message}));
    return Promise.reject(new Response(null, {status: 400}));
  }

  const dateString = getCurrentDate();

  const departureResponse = fetch(`https://traindata-stag-api.railsmart.io/api/trains/tiploc/${tiplocID}/${dateString}%2000:00:00/${dateString}%2023:59:59`, {
    headers: headers
  });

  const trainData: Promise<API_Departure[]> = departureResponse.then((response) => {
    if (!response.ok) { // If something went wrong on Velociti's end or API key expires, reject data
      return Promise.reject(response);
    }

    return response.json();
  }, () => { // If there is no connection or there is some grievous error in the fetch(), return a 500 response
    return Promise.reject(new Response(null, {status: 500}));
  })

  return trainData;
}

/**Fetch the current date*/
export function getCurrentDate(): string {
  const today = new Date(Date.now());
  const month = (today.getMonth() + 1).toString().length < 2 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1).toString();
  const date = (today.getDate()).toString().length < 2 ? "0" + today.getDate() : today.getDate().toString();

  return `${today.getFullYear()}-${month}-${date}`;
}

/**Fetch the current time*/
export function getFullCurrentTime(spacer: string = "T"): string {
  const currentDate = getCurrentDate();
  const today = new Date(Date.now())
  const hour = today.getHours().toString().length < 2 ? "0" + today.getHours() : today.getHours().toString();
  const mins = today.getMinutes().toString().length < 2 ? "0" + today.getMinutes() : today.getMinutes().toString();

  return `${currentDate}${spacer}${hour}:${mins}:00`; // To my knowledge, the seconds is always 00
}