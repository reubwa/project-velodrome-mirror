import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { Data } from "@/lib/innerDatabase";
import type { TiplocData } from "@/lib/tiplocLoader";

function TiplocPreviewBox({ tiploc, onClick = () => { } }: { tiploc: string, onClick?: (v: string) => void }) {
	const [Tiplocdat, setTiplocdat] = useState<null | TiplocData>(null);
	Data.GetTiploc(tiploc).then(v => setTiplocdat(v));

	return (
		<button onClick={() => onClick(tiploc)} className="
		border border-border border-l-primary border-l-4 rounded-md
		flex flex-col grow place-content-start place-items-start gap-2 p-4
		transition-all transition-250ms ease-out
		hover:scale-105 hover:shadow-md cursor-pointer
		">
				{ Tiplocdat ? (
					<>
						<h3 className="block h3">{Tiplocdat.Tiploc}</h3>
						<p className="block">{Tiplocdat.Name}</p>
					</>
				) : ( <Spinner/> )}
		</button>
	)
}

export default TiplocPreviewBox;