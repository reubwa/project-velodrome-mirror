import { RefreshCw } from "lucide-react";
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner";
import { dateformat } from "@/lib/dateFormat";
import { cn } from "@/lib/utils";

function Now(): Date { return new Date(Date.now()) }

export default function Refresher({ onRefresh = () => { } }: { onRefresh?: (refreshtime: Date) => void }) {
	const [LastRefreshed, setLastRefreshed] = useState<Date | null>(Now());
	const formatted = LastRefreshed ? dateformat(LastRefreshed) : null;

	function doRefresh() {
		const newtime = Now();
		setLastRefreshed(null);
		onRefresh(newtime);
		setLastRefreshed(newtime);
	}

	return <footer className="
		flex flex-row place-items-center justify-center
		border-t border-black/15 text-foreground/45 cursor-pointer
		p-1 gap-1
		" onClick={doRefresh} role="button">
		<span>Last updated:</span>
		{
			formatted ? <span>{formatted}</span>
				: <Spinner className="size-4" />
		}
		<RefreshCw className={cn("size-4", !formatted ? "animate-spin" : null)} />
	</footer>
}