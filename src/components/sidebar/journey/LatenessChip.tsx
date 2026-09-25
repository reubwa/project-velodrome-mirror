import { ClockAlert, ClockPlus } from "lucide-react";
import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";

export default function LatenessChip({ LatenessDescriptor, isEarly = false, isOverview = false, className }: { LatenessDescriptor?: string | undefined, isEarly: boolean, isOverview: boolean, className?: string }) {
	const icon = isEarly ? <ClockPlus className="size-3.5" /> : <ClockAlert className="size-3.5" />;


	return (
		<Badge className={
			cn(
				"p-2.5 gap-2",
				isOverview && className === "" ? "-ml-35" : "",
				isEarly ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
					: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
				className
			)}
			
		>
			{icon}
			{LatenessDescriptor}
		</Badge>
	);
}