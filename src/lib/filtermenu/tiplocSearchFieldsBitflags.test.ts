import { describe, expect, test } from "vitest";
import TiplocSearchFieldsBitflags from "./tiplocSearchFieldsBitflags";

describe("Test accurate translation of TiplocSearchFields bit flags", ()=>{
	const Flags = TiplocSearchFieldsBitflags.Flags;

	test("Validate accuracy of ToCombinedString", ()=>{
		expect(
			TiplocSearchFieldsBitflags.ToCombinedString(Flags.Tiploc | Flags.Codes)
		).toBe( "Tiploc, Codes," );
	});

	test("Validate evaluation of independent bitflags functions as expected for all valid values", ()=>{
		[
			[Flags.Tiploc, "Tiploc"],
			[Flags.Name, "Name"],
			[Flags.Codes, "Codes"]
		].forEach(v=>{
			expect(TiplocSearchFieldsBitflags.ToString(v[0] as number)).toBe(v[1])
		});
	})

	test("Validate error handling in bit flag conversion is handled correctly", ()=>{
		expect(
			TiplocSearchFieldsBitflags.ToString(-1)
		).toBe("unknown");
	})
});