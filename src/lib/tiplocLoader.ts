// React seems to despise namespaces (ts compiler, erasableSyntaxOnly)
// This is impl. as a static class instead.

interface TiplocDataContainer {
    ExportDate: string;
    ExportCount: number;
    Tiplocs: TiplocData[];
}

interface TiplocData {
    Name: string;
    Tiploc: string;
    Stanox?: number;
    InBPlan: boolean;
    InTPS: boolean;
    IsTiploc: boolean;
    Codes: string[];
    Details: TiplocDetails;
    Latitude: number;
    Longitude: number;
}

interface TiplocDetails {
    UIC?: number;
    Zone?: number;
    CompulsoryStop: boolean;
    OffNetwork: boolean;
    Nalco?: number;
    CRS?: string;
    BPlan_TimingPoint: BPlanTimingPoint;
    TPS_StationType: TPSStationType;
    TPS_StationCategory: TPSStationCategory;
    ForceLPB: ForceLPB;
}

// Enum of values. `enum` keyword is unsupported by compiler flags.
export const BPlanTimingPoint = {
    Mandatory: "Mandatory",
    Optional: "Optional",
    Trust: "Trust",
    Asterisk: "Asterisk",
    undefined: "Null"
}

// Enum of values.
export const TPSStationType = {
    undefined: "Null",
    Asterisk: "Asterisk",
    ExtraTiploc: "ExtraTiploc",
    Maintenance: "Maintenance",
    MandatoryTiploc: "MandatoryTiploc",
    NotSet: "NotSet",
    OptionalCrossing: "OptionalCrossing",
    OptionalFreight: "OptionalFreight",
    OptionalFreightOrCrossing: "OptionalFreightOrCrossing",
    OptionalPassenger: "OptionalPassenger",
    OptionalPassengerOrCrossing: "OptionalPassengerOrCrossing",
    OptionalStop: "OptionalStop",
    OptionalStopOrCrossing: "OptionalStopOrCorssing",
    OptionalStopOrFreight: "OptionalStopOrFreight",
    OptionalStopOrPassenger: "OptionalStopOrPassenger"
}

// Enum of values.
export const TPSStationCategory = {
    undefined: "Null",
    Asterisk: "Asterisk",
    CrossingOnly: "CrossingOnly",
    EngineeringLocation: "EngineeringLocation",
    FreightYard: "FreightYard",
    Interchange: "Interchange",
    InterchangePlanningLocation: "InterchangePlanningLocation",
    NetworkBoundary: "NetworkBoundary",
    NonPassenger: "NonPassenger",
    NonPassengerOrOperational: "NonPassengerOrOperational",
    NotSet: "NotSet",
    RoutingOnly: "RoutingOnly",
    StoppingOnly: "StoppingOnly",
    ThroughPlanning: "ThroughPlanning",
    ThroughPlanningLocation: "ThroughPlanningLocation"
}

// Enum of values. 
export const ForceLPB = {
    Asterisk: "Asterisk",
    B: "B",
    L: "L",
    Neither: "Neither",
    NotSet: "NotSet",
    P: "P"
}

class TiplocLoader {
    private static async GetTiplocData(): Promise<TiplocDataContainer> {
        const TIPLOC_FNAME = "tiplocs.json";
        console.log("begin loading static tiploc data...");
        return fetch(TIPLOC_FNAME)
            .then(v => {
                console.log("begin parsing tiploc data from json...");
                return v.json()
            });
    }

    public static async LoadTiplocData(): Promise<TiplocData[]> {
        return this.GetTiplocData().then(v => v.Tiplocs);
    }

    public static async LoadTiplocData_Iter(foreach_todo: (v: TiplocData) => void) {
        console.warn("The TiplocLoader.LoadTiplocData_Iter method is deprecated. Please use Data.ForAllData instead.");
        this.GetTiplocData()
            .then(v => {
                console.log("done parsing document! begin iteration.")
                v.Tiplocs.forEach(foreach_todo);
            });
    }
}

export {
    TiplocLoader,
    type TiplocData,
    type TiplocDetails
}
export type BPlanTimingPoint = typeof BPlanTimingPoint[keyof typeof BPlanTimingPoint];
export type TPSStationType = typeof TPSStationType[keyof typeof TPSStationType];
export type TPSStationCategory = typeof TPSStationCategory[keyof typeof TPSStationCategory];
export type ForceLPB = typeof ForceLPB[keyof typeof ForceLPB];