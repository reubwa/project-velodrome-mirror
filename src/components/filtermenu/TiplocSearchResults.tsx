import { SquareDashed } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import TiplocPreviewBox from "./TiplocPreviewBox";
import { Data } from "@/lib/innerDatabase";
import type { TiplocData } from "@/lib/tiplocLoader";

function TiplocSearchResults({ limit = 32, query, onClick = _ => { } }: { limit?: number, query: any, onClick?: (v: string) => void }) {
	const [TiplocFilterResults, setTiplocFilterResults] = useState<string[] | null>(null);

	async function CollectFilterResults() {
		const store = await Data.GetTiplocs(Data.GetStore());
		const newresults = store.chain().find(query).limit(limit).data().map(v => {
			return (v as any as TiplocData).Tiploc;
		});
		setTiplocFilterResults(newresults);
	}
	useEffect(
		() => { CollectFilterResults() }, [query]
	)

	return TiplocFilterResults ?
		TiplocFilterResults.length > 0 ? (
			<>
				{
					// show tiplocs in query array
					TiplocFilterResults.map(v => (
						<TiplocPreviewBox key={v} tiploc={v} onClick={onClick} />
					))
				}
				{
					// show hint when returned output is limited
					TiplocFilterResults.length >= limit ? (
						<>
							<hr />
							<p className="typo-subtle">Limited results to {limit}<br />See map for all filtered TIPLOCs</p>
						</>
					) : null
				}
			</>
		) : (
			/* Placeholder for no results */
			<div className="
					flex flex-col place-items-center align-items-center 
					bg-muted text-foreground-muted rounded-md
					p-8 gap-4
					border border-dashed 
					">
				<SquareDashed className="size-20 fill-black/30" />
				<h2 className="h2 text-foreground">No Results</h2>
			</div>
		) : (<Spinner />);
}

export default TiplocSearchResults;