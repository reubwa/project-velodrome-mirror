import { describe, expect, test } from "vitest";
import type { API_Departure } from "./departuresStruct";
import * as RailAPI from "@/lib/railAPIHandler";

const sampleDepartures: API_Departure[] = [
  {
    originTiploc: "TINSGBR",
    destinationTiploc: "THMSLGB",
    toc_Name: "GB Railfreight",
    sector_Code: 54,
    activationId: 19240064,
    scheduleId: 23677312,
    headCode: "4L19",
    trainId: "254L19CA23",
    trainUid: "H03326",
    trainServiceCode: "55460180",
    activatedDeparture: "2026-03-23T07:21:00",
    actualDeparture: "2026-03-23T07:21:00",
    actualArrival: "2026-03-23T14:46:00",
    originLocation: "TINSLEY YARD GBRF",
    scheduledDeparture: "2026-03-23T07:21:00",
    scheduledArrival: "2026-03-23T16:24:00",
    destinationLocation: "LONDON GATEWAY GBRF",
    lastReported: "2026-03-23T14:46:00",
    lastReportedDelay: 0,
    lastReportedLocation: "CANONBURY WEST JN",
    lastReportedType: "TERMINATED",
    cancelled: false,
    cancelledAtOrigin: false,
    cancelledImmediatly: false,
    cancelledEnRoute: false,
    cancelledOutOfPlan: false,
    scheduleCancelled: false,
    scheduleJustForToday: false,
    hasSchedule: true,
    shouldHaveDepartedException: false,
    offRoute: false
  },
  {
    originTiploc: "TINSGBR",
    destinationTiploc: "BARDGBR",
    toc_Name: "GB Railfreight",
    sector_Code: 54,
    activationId: 19240163,
    scheduleId: 23317135,
    headCode: "6M01",
    trainId: "256M01CH23",
    trainUid: "H51451",
    trainServiceCode: "51464580",
    activatedDeparture: "2026-03-23T10:51:00",
    actualDeparture: "2026-03-23T10:51:00",
    actualArrival: "2026-03-23T14:44:00",
    originLocation: "TINSLEY YARD GBRF",
    scheduledDeparture: "2026-03-23T10:51:00",
    scheduledArrival: "2026-03-23T15:49:00",
    destinationLocation: "BARDON HILL GBRF",
    lastReported: "2026-03-23T14:44:00",
    lastReportedDelay: -65,
    lastReportedLocation: "BARDON HILL GBRF",
    lastReportedType: "TERMINATED",
    cancelled: false,
    cancelledAtOrigin: false,
    cancelledImmediatly: false,
    cancelledEnRoute: false,
    cancelledOutOfPlan: false,
    scheduleCancelled: false,
    scheduleJustForToday: false,
    hasSchedule: true,
    shouldHaveDepartedException: false,
    offRoute: false
  },
  {
    originTiploc: "FLXSSGB",
    destinationTiploc: "TINSGBR",
    toc_Name: "GB Railfreight",
    sector_Code: 54,
    activationId: 19240396,
    scheduleId: 23362947,
    headCode: "4E21",
    trainId: "494E21CI23",
    trainUid: "H29341",
    trainServiceCode: "55460180",
    activatedDeparture: "2026-03-23T11:18:00",
    actualDeparture: "2026-03-23T11:45:00",
    actualArrival: "2026-03-23T17:49:00",
    originLocation: "FELIXSTOWE SOUTH GBRF",
    scheduledDeparture: "2026-03-23T11:18:00",
    scheduledArrival: "2026-03-23T17:52:00",
    destinationLocation: "TINSLEY YARD GBRF",
    lastReported: "2026-03-23T17:49:00",
    lastReportedDelay: -3,
    lastReportedLocation: "TINSLEY YARD GBRF",
    lastReportedType: "TERMINATED",
    cancelled: false,
    cancelledAtOrigin: false,
    cancelledImmediatly: false,
    cancelledEnRoute: false,
    cancelledOutOfPlan: false,
    scheduleCancelled: false,
    scheduleJustForToday: false,
    hasSchedule: true,
    shouldHaveDepartedException: false,
    offRoute: false
  },
  {
    originTiploc: "TINSGBR",
    destinationTiploc: "THMSLGB",
    toc_Name: "GB Railfreight",
    sector_Code: 54,
    activationId: 19240770,
    scheduleId: 23758301,
    headCode: "4G00",
    trainId: "254G002S23",
    trainUid: " 62526",
    trainServiceCode: "55460180",
    activatedDeparture: "2026-03-23T16:17:00",
    actualDeparture: "2026-03-23T16:17:00",
    actualArrival: "2026-03-24T01:13:00",
    originLocation: "TINSLEY YARD GBRF",
    scheduledDeparture: "2026-03-23T16:17:00",
    scheduledArrival: "2026-03-24T01:09:00",
    destinationLocation: "LONDON GATEWAY GBRF",
    lastReported: "2026-03-24T01:13:00",
    lastReportedDelay: 4,
    lastReportedLocation: "LONDON GATEWAY GBRF",
    lastReportedType: "TERMINATED",
    cancelled: false,
    cancelledAtOrigin: false,
    cancelledImmediatly: false,
    cancelledEnRoute: false,
    cancelledOutOfPlan: false,
    scheduleCancelled: false,
    scheduleJustForToday: true,
    hasSchedule: true,
    shouldHaveDepartedException: false,
    offRoute: false
  },
  {
    originTiploc: "TINSGBR",
    destinationTiploc: "FLXSNGB",
    toc_Name: "GB Railfreight",
    sector_Code: 54,
    activationId: 19241302,
    scheduleId: 23104262,
    headCode: "4L21",
    trainId: "254L21C723",
    trainUid: "H29414",
    trainServiceCode: "55460180",
    activatedDeparture: "2026-03-23T21:35:00",
    actualDeparture: "2026-03-23T21:35:00",
    actualArrival: "2026-03-24T05:24:00",
    originLocation: "TINSLEY YARD GBRF",
    scheduledDeparture: "2026-03-23T21:35:00",
    scheduledArrival: "2026-03-24T05:15:00",
    destinationLocation: "FELIXSTOWE NORTH GBRF",
    lastReported: "2026-03-24T05:24:00",
    lastReportedDelay: 9,
    lastReportedLocation: "FELIXSTOWE NORTH GBRF",
    lastReportedType: "TERMINATED",
    cancelled: false,
    cancelledAtOrigin: false,
    cancelledImmediatly: false,
    cancelledEnRoute: false,
    cancelledOutOfPlan: false,
    scheduleCancelled: false,
    scheduleJustForToday: false,
    hasSchedule: true,
    shouldHaveDepartedException: false,
    offRoute: false
  }
];
const sampleOrigin = "TINSGBR";

describe("Departure processor tests", () => {
  const goodDepartures = RailAPI.processStationDepartures(sampleDepartures, sampleOrigin);
  test("Expect departures to exist", () => {
    expect(goodDepartures.length).toBeGreaterThan(0);
  });

  test("Expect departures to not include arrivals", () => {
    goodDepartures.forEach(depart => {
      expect(depart).not.toHaveProperty("Destination", sampleOrigin);
    });
  });
});

describe("Journey processor tests (Deprecated)", () => {
  const goodJourneys = RailAPI.processJourneyData(sampleDepartures, sampleOrigin);
  test("Expect journeys to exist", () => {
    expect(goodJourneys.length).toBeGreaterThan(0);
  });
});