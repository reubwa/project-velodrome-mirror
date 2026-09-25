import { test, expect, describe } from "vitest";
import TiplocSearchFormResult_ToFilter from "./tiplocSearchFormResult_toFilter";
import type TiplocSearchFormResult from "./tiplocSearchFormResult";
import TiplocSearchFieldsBitflags from "./tiplocSearchFieldsBitflags";



describe("TiplocSearchForm LokiDB query translation", () => {
	const basictext = "bjarg";

	test('Ensure filters can be generated for combined form results.', () => {
		const form: TiplocSearchFormResult = {
			SearchText: basictext,
			SearchFields: TiplocSearchFieldsBitflags.Flags.Name | TiplocSearchFieldsBitflags.Flags.Codes
		};

		expect(TiplocSearchFormResult_ToFilter(form)).toStrictEqual({
			"$or": [
				{ "Name": { "$regex": basictext } },
				{ "Codes": { "$regex": basictext } }
			]
		});
	});

	test('Ensure filter generation works for Name', () => {
		const form: TiplocSearchFormResult = {
			SearchText: basictext,
			SearchFields: TiplocSearchFieldsBitflags.Flags.Name
		};

		expect(TiplocSearchFormResult_ToFilter(form)).toStrictEqual({
			"Name": { "$regex": basictext }
		});
	});

	test('Ensure filter generation works for Tiploc', () => {
		const form: TiplocSearchFormResult = {
			SearchText: basictext,
			SearchFields: TiplocSearchFieldsBitflags.Flags.Tiploc
		};

		expect(TiplocSearchFormResult_ToFilter(form)).toStrictEqual({
			"Tiploc": { "$regex": basictext }
		});
	});

	test('Ensure filter recognises empty queries and does not attempt to process them', () => {
		const form: TiplocSearchFormResult = {
			SearchText: "",
			SearchFields: 0x0
		};

		expect(TiplocSearchFormResult_ToFilter(form)).toStrictEqual({});
	})
})
