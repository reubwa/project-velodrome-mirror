import { Circle } from "lucide-react";
import type { Stop } from "@/lib/departuresStruct";
import InterpretLiveTimetable from "@/lib/journey/interpretLiveTimetable";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function JourneyStateIndicator({ subject, cancelled } : { subject : Stop[], cancelled : boolean }) {
    const commonStyle = "px-2.5 h-fit gap-2 border-black/20"

    switch (InterpretLiveTimetable(subject, cancelled)) {
        case "notStarted":
            return <Badge className={cn(commonStyle, "text-gray-800 stroke-gray-800 bg-gray-200")}><Circle className="size-4" /><span>Not Started</span></Badge>
        case "cancelled":
            return <Badge className={cn(commonStyle, "text-red-800 stroke-red-800 bg-red-200")}><Circle className="size-4" /><span>Cancelled</span></Badge>
        case "completed":
            return <Badge className={cn(commonStyle, "text-lime-800 stroke-lime-800 bg-lime-200")}><Circle className="size-4" /><span>Completed</span></Badge>
        case "inProgress":
        default:
            return <Badge className={cn(commonStyle, "text-amber-800 stroke-amber-800 bg-amber-200")}><Circle className="size-4" /><span>In Progress</span></Badge>
    }
}