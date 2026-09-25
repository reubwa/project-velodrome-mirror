import { describe, expect, test, vi, afterEach } from "vitest";
import * as JourneyFetch from "./fetchJourney"
import * as RailAPI from "./railAPI"
import { processJourneyData } from "@/lib/railAPIHandler";

vi.mock(import("nitro/runtime-config"), () => ({
  useRuntimeConfig() {
    return { apiKey: import.meta.env.NITRO_API_KEY };
  }
}));
const fetchMock = vi.spyOn(globalThis, "fetch");

const headersMock = vi.spyOn(RailAPI, "getAPIFetchHeaders");
const badHeadersMock = () => {
  const badHeaders = new Headers();
  badHeaders.set("X-ApiKey", "bad");
  badHeaders.set("Connection", "keep-alive");
  badHeaders.set("Accept", "application/json");
  return badHeaders;
};
const noKeyHeadersMock = () => { throw new ReferenceError("No API key."); } // Simulates error throw from no API key

const isProd = import.meta.env.PROD;
const testTiploc = "TINSGBR";
const fallbackTiploc = "IMNGCIT";

// TODO: Rework unit tests when fetchers are refined. They currently return strings instead of HTTP Responses

describe.sequential("Journey fetch tests", () => {
  afterEach(() => {
    headersMock.mockReset();
    fetchMock.mockReset();
  });

  test.skipIf(isProd)("Test for successful response", async () => {
    let journeys = processJourneyData(await RailAPI.fetchRawDepartures(testTiploc), testTiploc);
    if (journeys.length == 0) journeys = processJourneyData(await RailAPI.fetchRawDepartures(fallbackTiploc), fallbackTiploc);
    if (journeys.length == 0) return;
    await expect(JourneyFetch.fetchRawJourney(journeys[0].activationId, journeys[0].scheduleId)).resolves.toBeDefined();
  });

  test("Test for reject on no API key", async () => {
    // Header method throws if no API key
    headersMock.mockImplementation(noKeyHeadersMock);

    await expect(JourneyFetch.fetchRawJourney("doesn't matter", "doesn't matter")).rejects.toBeDefined();
  });

  test("Test for reject on bad API key", async () => {
    headersMock.mockImplementation(badHeadersMock);

    await expect(JourneyFetch.fetchRawJourney("doesn't matter", "doesn't matter")).rejects.toBeDefined();
  });

  test("Test for reject on bad request", async () => {
    headersMock.mockImplementation(badHeadersMock); // Mocking arbitrary headers to ensure test flows as intended
    fetchMock.mockReturnValue(Promise.reject());

    await expect(JourneyFetch.fetchRawJourney("doesn't matter", "doesn't matter")).rejects.toBeDefined();
  })
});

describe.sequential("Movement fetch tests", () => {
  afterEach(() => {
    headersMock.mockReset();
    fetchMock.mockReset();
  });

  test.skipIf(isProd)("Test for successful response", async () => {
    let departureData = await RailAPI.fetchRawDepartures(testTiploc);
    if (departureData.length == 0) departureData = await RailAPI.fetchRawDepartures(fallbackTiploc);
    if (departureData.length == 0) return;

    const journeyWithMovement = departureData.find(depart => {
      switch (depart.lastReportedType) {
        case "DEPARTURE":
        case "ARRIVAL":
        case "TERMINATED": return true;
        default: return false;
      }
    });
    if (!journeyWithMovement) return;

    await expect(JourneyFetch.fetchRawMovement(journeyWithMovement.activationId.toString(), journeyWithMovement.scheduleId.toString())).resolves.toBeDefined();
  });

  test("Test for reject on no API key", async () => {
    headersMock.mockImplementation(noKeyHeadersMock);

    await expect(JourneyFetch.fetchRawMovement("doesn't matter", "doesn't matter")).rejects.toMatchObject({status: 401});
  });

  test("Test for reject on bad API key", async () => {
    headersMock.mockImplementation(badHeadersMock);

    await expect(JourneyFetch.fetchRawMovement("doesn't matter", "doesn't matter")).rejects.toMatchObject({status: 401});
  });
  
  test("Test for handling bad response", async () => {
    fetchMock.mockImplementation(async () => Response.error());
  
    await expect(JourneyFetch.fetchRawMovement("doesn't matter", "doesn't matter")).rejects.toBeInstanceOf(Response);
  });

  test("Test for reject on bad request", async () => {
    headersMock.mockImplementation(badHeadersMock); // Mocking arbitrary headers to ensure test flows as intended
    fetchMock.mockReturnValue(Promise.reject());

    await expect(JourneyFetch.fetchRawMovement("doesn't matter", "doesn't matter")).rejects.toMatchObject({status: 500});
  });
});