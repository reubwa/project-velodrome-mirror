/**Only contains necessary fields (i.e. not all returned from the API)*/
interface Departure {
	Time: string,
	Destination: string,
	isCancelled: boolean,
	cancelledTimestamp?: string | undefined,
	trainUid: string,
	activationId: number,
	scheduleId: number,
}

/**Only contains necessary fields (i.e. not all returned from the API) and a few calculated on first retrieval*/
interface Stop {
	Tiploc: string,
	Name: string,
	ScheduledTime: string,
    actualTime? : string,
	isLate: boolean,
    isEarly : boolean,
	LatenessOrEarlinessDescriptor?: string,
    Passed : boolean
}

/**Only contains necessary fields (i.e. not all returned from the API) and a few calculated on first retrieval*/
interface Journey {
	trainUID: string,
	activationId: string,
	scheduleId: string,
    isCancelled : boolean,
    cancelledTimestamp : string | undefined
}

/* Above is for the depratures sidebar panel, below is for the API response */

/**Contains all necessary fields to handle data from API responses*/
interface API_TrainMovement {
	location: string,
	eventType: string,
	planned: string,
	actual: string,
	variation: number,
	plannedDeparture: string,
	actualDeparture: string,
    actualArrival : string,
    plannedArrival : string
}

/**Contains all necessary fields to handle data from API responses*/
interface API_SchedulePoint {
	departure: string | undefined,
	pass: string | undefined,
	arrival: string | undefined,
	tiploc: string,
	location: string,
	latLong?: {
		latitude: number,
		longitude: number
	}
}

/**Contains all necessary fields to handle data from API responses*/
interface API_Departure {
	originTiploc: string,
	destinationTiploc: string,
	toc_Name: string,
	sector_Code: number,
	activationId: number,
	scheduleId: number,
	headCode: string,
	trainId: string,
	trainUid: string,
	trainServiceCode: string,
	activatedDeparture: string,
	actualDeparture: string,
	actualArrival: string,
	originLocation: string,
	scheduledDeparture: string,
	scheduledArrival: string,
	destinationLocation: string,
	lastReported: string,
	lastReportedDelay: number,
	lastReportedLocation: string,
	lastReportedType: string,
	cancelled: boolean,
	cancelledAtOrigin: boolean,
	cancelledImmediatly: boolean, // This is an actual typo in the API response
	cancelledEnRoute: boolean,
	cancelledOutOfPlan: boolean,
    cancelledTimestamp?: string | undefined,
	scheduleCancelled: boolean,
	scheduleJustForToday: boolean,
	hasSchedule: boolean,
	shouldHaveDepartedException: boolean,
	offRoute: boolean
}

export {
	type Departure,
	type Stop,
	type API_Departure,
	type API_SchedulePoint,
	type Journey,
	type API_TrainMovement
}