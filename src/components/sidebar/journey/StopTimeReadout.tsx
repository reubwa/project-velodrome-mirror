import { ArrowRight } from "lucide-react";
import LatenessChip from "./LatenessChip";
import type { Stop } from "@/lib/departuresStruct";


/**
 * Readout box for a particular Stop's planned and arrival time.
 */
export default function StopTimeReadout({ Subject }: { Subject: Stop }) {
    return <div className="flex flex-row place-content-between place-items-center">
        {
            !Subject.actualTime
                // If there is no arrival time, show sheduled only.
                ?
                <h3 className="h3">{Subject.ScheduledTime}</h3>

                // Otherwise, show time delta layout.
                :
                <span className="flex flex-row gap-1 place-items-center">
                    <h3 className="h3 thin-h line-through text-muted-foreground">{Subject.ScheduledTime}</h3>
                    <ArrowRight className="size-4 stroke-muted-foreground" />
                    <h3 className="h3"> {Subject.actualTime}</h3>
                </span>
        }
        {
            Subject.isLate || Subject.isEarly ? <LatenessChip 
                LatenessDescriptor={Subject.LatenessOrEarlinessDescriptor} 
                isEarly={Subject.isEarly} 
                isOverview={false} 
                className="grow-0" 
            />
                : null
        }
    </div>
}