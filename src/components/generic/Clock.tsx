import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function Clock() {
	const [time, setTime] = useState(new Date());
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const formattedTime = time.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
	const formattedDate = time.toLocaleDateString([], {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});
	const formattedDay = time.toLocaleDateString([], {
		weekday: 'long'
	});

	return (
		<div
			className={cn(
				"pointer-events-auto",
				"flex flex-col items-center bg-white text-foreground px-4 py-2 rounded-b-xl outline-overmap",
				isExpanded ? "gap-4" : "gap-1"
			)}>
			<div
				className={cn(
					"grid transition-all duration-300 ease-in-out overflow-hidden text-center",
					isExpanded ? "grid-rows-[1fr] opacity-100 pb-4 border-b" : "grid-rows-[0fr] opacity-0 height-0"
				)}>
				<div className="min-h-0 flex flex-row gap-2 items-center">
					<span>{formattedDay},</span>
					<span>{formattedDate}</span>
				</div>
			</div>
			<div className="flex flex-row gap-2 w-full justify-between items-center">
				<Button variant="ghost" size="fit" onClick={() => setIsExpanded(!isExpanded)}>
					<ChevronDown className={cn("size-8 transition-transform transition-200ms", isExpanded ? "transform-[rotate(180deg)]" : "transform-none")} />
				</Button>
				<span className="h1 tracking-wide" style={{ fontSize: "20px", fontWeight: "700" }}>
					{formattedTime}
				</span>
			</div>
		</div>
	);
}