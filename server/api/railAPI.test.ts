import { describe, expect, test, vi, afterEach } from "vitest";
import * as runtimeConfig from "nitro/runtime-config";
import * as RailAPI from "./railAPI.ts";

describe("Date getter tests", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("Ensure today's date is formatted correctly", () => {
    const today = new Date(Date.now());
    const month = (today.getMonth() + 1 < 10) ? `0${today.getMonth() + 1}` : (today.getMonth() + 1).toString();
    const day = (today.getDate() < 10) ? `0${today.getDate()}` : today.getDate().toString();

    const testDate = RailAPI.getCurrentDate();
    expect(testDate).equal(`${today.getFullYear()}-${month}-${day}`)
  });

  test("Ensure single digit dates are formatted correctly", () => {
    vi.setSystemTime(new Date("January 1, 2026"));

    expect(RailAPI.getCurrentDate()).equal("2026-01-01");
  });

  test("Ensure double digit dates are formatted correctly", () => {
    vi.setSystemTime(new Date("December 12, 2025"));

    expect(RailAPI.getCurrentDate()).equal("2025-12-12");
  });

  test("Ensure today's full time is formatted correctly", () => {
    const spacer = "T";

    const today = new Date(Date.now());
    const month = (today.getMonth() + 1 < 10) ? `0${today.getMonth() + 1}` : (today.getMonth() + 1).toString();
    const day = (today.getDate() < 10) ? `0${today.getDate()}` : today.getDate().toString();
    const hour = (today.getHours() < 10) ? `0${today.getHours()}` : today.getHours().toString();
    const mins = (today.getMinutes() < 10) ? `0${today.getMinutes()}` : today.getMinutes().toString();

    const testDate = RailAPI.getFullCurrentTime(spacer);
    expect(testDate).equal(`${today.getFullYear()}-${month}-${day}${spacer}${hour}:${mins}:00`);
  });

  test("Ensure single digit time is formatted correctly", () => {
    vi.setSystemTime(new Date("January 1, 2026 09:01"));

    expect(RailAPI.getFullCurrentTime("T")).equal("2026-01-01T09:01:00");
  });

  test("Ensure double digit time is formatted correctly", () => {
    vi.setSystemTime(new Date("December 12, 2025 12:30"));

    expect(RailAPI.getFullCurrentTime("T")).equal("2025-12-12T12:30:00");
  });
});

// Mocking API key because Nitro's runtimeConfig getter doesn't appear to work during unit test
const keyGetter = () => ({ apiKey: import.meta.env.NITRO_API_KEY });
const runtimeConfigMock = vi.spyOn(runtimeConfig, "useRuntimeConfig").mockImplementation(keyGetter);

const isProd = import.meta.env.PROD

describe.sequential("API fetcher tests", () => {
  const testTiploc = "TINSGBR";
  const fetchSpy = vi.spyOn(globalThis, "fetch");

  afterEach(() => {
    fetchSpy.mockReset();
    runtimeConfigMock.mockReset();
    runtimeConfigMock.mockImplementation(keyGetter);
  });

  test.skipIf(isProd)("Ensure API key is present", () => {
    const headers = RailAPI.getAPIFetchHeaders();
    expect(headers).toBeDefined();
    expect(headers.get("X-ApiKey")).toEqual(import.meta.env.NITRO_API_KEY);
  });

  test("Header method will throw if no key", () => {
    runtimeConfigMock.mockReturnValue({ apiKey: undefined })

    expect(() => RailAPI.getAPIFetchHeaders()).toThrow();
  });


  test.skipIf(isProd)("Test for successful response", async () => {
    await expect(RailAPI.fetchRawDepartures(testTiploc)).resolves.toBeDefined();
    expect(fetchSpy).toHaveResolved();
  });

  test("Test for 401 Response if no API key", async () => {
    runtimeConfigMock.mockReturnValue({ apiKey: undefined })

    await expect(RailAPI.fetchRawDepartures(testTiploc)).rejects.toMatchObject({status: 401});
  });

  test("Test for 401 Response if bad API key", async () => {
    runtimeConfigMock.mockReturnValue({ apiKey: "badkey" })

    await expect(RailAPI.fetchRawDepartures(testTiploc)).rejects.toMatchObject({status: 401});
  });

  test("Test for handling bad response", async () => {
    fetchSpy.mockImplementation(async () => Response.error());

    await expect(RailAPI.fetchRawDepartures(testTiploc)).rejects.toBeInstanceOf(Response);
  });

  test("Test for handling malformed request", async () => {
    runtimeConfigMock.mockReturnValue({ apiKey: "doesntmatter" });
    fetchSpy.mockReturnValue(Promise.reject());

    await expect(RailAPI.fetchRawDepartures(testTiploc)).rejects.toMatchObject({status: 500});
  });
});