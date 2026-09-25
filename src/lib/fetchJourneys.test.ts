import { test, describe, expect, vi, afterEach } from "vitest"
import { fetchRawDepartures } from "server/api/railAPI";
import { fetchRawJourney } from "server/api/fetchJourney";
import { getJourneys } from "./fetchJourneys"

const isProd = import.meta.env.PROD;
const testTiploc = "TINSGBR";
const fallbackTiploc = "IMNGCIT";

vi.mock(import("nitro/runtime-config"), () => ({
	useRuntimeConfig() {
		return { apiKey: import.meta.env.NITRO_API_KEY };
	}
}));
const fetchMock = vi.spyOn(globalThis, "fetch");

describe("Client journey fetching tests", () => {
	afterEach(() => {
		fetchMock.mockReset();
	});

	test.skipIf(isProd)("Test for successful journey fetch", async () => {
		let departures = await fetchRawDepartures(testTiploc);
		if (departures.length == 0) departures = await fetchRawDepartures(fallbackTiploc);
		if (departures.length == 0) return;

		const activationID = departures[0].activationId.toString()
		const scheduleID = departures[0].scheduleId.toString()

		// Client-side fetcher must be mocked because server function routing does not exist in unit test env
		fetchMock.mockReturnValue(fetchRawJourney(activationID, scheduleID)
			.then(data => Response.json(data), reason => reason));

		await expect(getJourneys(activationID, scheduleID)).resolves.toEqual(
			expect.arrayContaining([expect.objectContaining({ tiploc: expect.any(String) })])
		);
	})

	test("Test for lack of server-client connection", async () => {
		fetchMock.mockReturnValueOnce(Promise.reject(Response.error()));

		await expect(getJourneys("doesn't matter", "doesn't matter")).rejects.toBeDefined();
	})

	test("Expect bad activation IDs to be rejected", async () => {

		fetchMock.mockReturnValue(fetchRawJourney("bad", "bad")
			.then(data => Response.json(data), reason => reason));

		await expect(getJourneys("bad", "bad")).rejects.toBeDefined();
	})
})