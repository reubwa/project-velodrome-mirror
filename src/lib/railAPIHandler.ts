import type { API_Departure, Departure, Journey } from "./departuresStruct";

export function processStationDepartures(rawDepartures: API_Departure[], originTiplocID: string): Departure[] {
  const departures: Departure[] = [];

  rawDepartures.forEach((d) => {
    if (d.originTiploc != originTiplocID) return;
    const depart: Departure = {
      Time: d.actualDeparture ?? d.scheduledDeparture ?? d.activatedDeparture, // idk how to properly handle departure time so this is band-aid
      Destination: d.destinationLocation,
      isCancelled: d.cancelled,
      cancelledTimestamp: d.cancelledTimestamp,
      trainUid: d.trainUid,
      activationId: d.activationId,
      scheduleId: d.scheduleId
    }

    departures.push(depart);
  })

  return departures;
}

/*
  NOTICE
  The folllowing methods are to be reworked/deprecated during sprint 2
*/

export function processJourneyData(rawDepartures: API_Departure[], originTiplocID: string): Journey[] {
  const journeys: Journey[] = [];

  rawDepartures.forEach((d) => {
    if (d.originTiploc != originTiplocID) return;

    const journey: Journey = {
      trainUID: d.trainUid,
      activationId: d.activationId.toString(),
      scheduleId: d.scheduleId.toString(),
      isCancelled: d.cancelled,
      cancelledTimestamp: d.cancelledTimestamp
    }

    journeys.push(journey);
  })

  return journeys;
}