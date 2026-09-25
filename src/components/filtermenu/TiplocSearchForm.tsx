import { useState } from "react";
import { FunnelPlus, FunnelX } from "lucide-react";
import SearchBar from "../generic/SearchBar";
import { Button } from "../ui/button";
import ManagedForm from "../generic/ManagedForm";
import TiplocSearchFields, { TiplocSearchFieldsBitflags } from "./TiplocSearchFields";
import XorHash from "@/lib/xorhash";
import type TiplocSearchFormResult from "@/lib/filtermenu/tiplocSearchFormResult";

function TiplocSearchForm(
	{ onSubmit = () => { } }:
		{ onSubmit?: ((v: TiplocSearchFormResult) => void) }) {
	// Define defaults
	const DefaultFormData: TiplocSearchFormResult = {
		SearchText: "",
		SearchFields: TiplocSearchFieldsBitflags.Flags.Tiploc | TiplocSearchFieldsBitflags.Flags.Name
	}

	const [SearchText, setSearchText] = useState(DefaultFormData.SearchText);
	const [SearchFields, setSearchFields] = useState(DefaultFormData.SearchFields);
	const [LastContentHash, setLastContentHash] = useState(0);

	function CompileFormData(): TiplocSearchFormResult {
		return {
			SearchText,
			SearchFields
		}
	}

	function ResetForm() {
		setSearchText("");
		setSearchFields(TiplocSearchFieldsBitflags.Flags.Tiploc | TiplocSearchFieldsBitflags.Flags.Name);
		setLastContentHash(0);

		onSubmit(DefaultFormData);
	}

	function DrawResetButton() {
		return (
			<Button variant="destructive" size="lg" onClick={e => { e.preventDefault(); ResetForm(); }}>
				<FunnelX className="size-4" /> Reset
			</Button>
		)
	}

	return (
		<ManagedForm onSubmit={() => {
			const formdata = CompileFormData();
			const formhash = XorHash(JSON.stringify(formdata));

			console.log(formdata);
			console.log(formhash);

			// If this form data is the same as the last submitted, don't bother submitting again
			if (LastContentHash == formhash) return;
			setLastContentHash(formhash);

			// Run external predicate with formatted data, only when changes are detected.
			onSubmit(formdata);
		}}
			className="flex flex-col gap-4 items-center">
			<SearchBar onChange={setSearchText} value={SearchText} />

			<TiplocSearchFields onChange={setSearchFields} value={SearchFields} />

			<div className="flex flex-row gap-4 w-full">
				<Button variant="outline" size="lg">
					<FunnelPlus className="size-4" /> Apply Filter
				</Button>
				{LastContentHash != 0 ? DrawResetButton() : null}
			</div>
		</ManagedForm>
	)
}

export default TiplocSearchForm;
export { TiplocSearchForm, type TiplocSearchFormResult };