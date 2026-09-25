import { Check, ChevronLeft, Dot } from "lucide-react";
import { useState } from "react";
import { Toggle } from "../ui/toggle";
import TiplocSearchFieldsBitflags from "@/lib/filtermenu/tiplocSearchFieldsBitflags";

function TiplocSearchFields({ value = (TiplocSearchFieldsBitflags.Flags.Tiploc | TiplocSearchFieldsBitflags.Flags.Name), onChange = () => { } }: { value?: number, onChange?: (v: number) => void }) {
	const [IsExpanded, setIsExpanded] = useState(false);

	function ToggleBit(v: number) {
		onChange(value ^ v);
	}

	function Expanded() {
		return (
			<div className="grid grid-cols-2 border-t border-grey p-2 gap-2 overflow-clip">
				{
					Object.values(TiplocSearchFieldsBitflags.Flags).map(v => (
						<Toggle key={v} size="lg" variant="outline" className="flex flex-row justify-start" pressed={(value & v) > 0} onPressedChange={() => ToggleBit(v)}>
							{((value & v) > 0) ? (<Check />) : (<Dot />)}
							{TiplocSearchFieldsBitflags.ToString(v)}
						</Toggle>
					))
				}
			</div>
		)
	}

	return (
		<div className="border border-border rounded-md dark:bg-input/30 overflow-hidden w-full">
			<header className="
				flex flex-row justify-between align-end p-2 
				hover:bg-input/50 cursor-pointer
				" role="switch" title="Show/Hide field toggles" onClick={() => setIsExpanded(!IsExpanded)}>
				<div className="flex flex-col w-full">
					<p className="typo-subtle">Searching fields:</p>
					<h3 className="h3">{TiplocSearchFieldsBitflags.ToCombinedString(value)}</h3>
				</div>
				<ChevronLeft className={"size-10 transition-transform " + (IsExpanded ? "transform-[rotate(-90deg)]" : "transform-none")} />
			</header>
			{IsExpanded ? Expanded() : null}
		</div>
	);
}

export default TiplocSearchFields;

export { TiplocSearchFields, TiplocSearchFieldsBitflags }