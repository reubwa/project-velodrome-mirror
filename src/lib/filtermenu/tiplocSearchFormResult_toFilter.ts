/* eslint-disable @typescript-eslint/no-explicit-any */
import TiplocSearchFieldsBitflags from "./tiplocSearchFieldsBitflags";
import type TiplocSearchFormResult from "./tiplocSearchFormResult";

export default function TiplocSearchFormResult_ToFilter(tsf: TiplocSearchFormResult) {
	// Early exit for searches with no text constraint
	if (tsf.SearchText == "") return {};

	// Construct query.
	const o = { "$or": [] }
	// Check for all possible fields;
	Object.values(TiplocSearchFieldsBitflags.Flags).forEach(v => {
		// For active fields;
		if ((v & tsf.SearchFields) != 0) {
			const fieldname = TiplocSearchFieldsBitflags.ToString(v);
			const subconstraint: any = {};
			subconstraint[fieldname] = { "$regex": tsf.SearchText };
			// Add sub-constraint on data to OR clause.
			(o["$or"] as any[]).push(subconstraint);
		}
	});

	// Catch one-entry scenarios;
	if (o["$or"].length <= 1) return (o["$or"][0]);

	return o;
}