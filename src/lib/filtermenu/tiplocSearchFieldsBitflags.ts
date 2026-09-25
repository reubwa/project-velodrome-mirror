
/**
 * Collection of methods and definition of the TiplocSearchField's flags.
 * 
 * Do not instance this class.
 */
export default class TiplocSearchFieldsBitflags {
	/**
	 * Bitflag indicating which search fields are enabled.
	 */
	public static Flags = {
		Tiploc: 0b0001,
		Name: 0b0010,
		Codes: 0b0100,
	}

	/**
	 * Converts explicit bitflag to string representation.
	 */
	public static ToString(v: number) {
		switch (v) {
			case TiplocSearchFieldsBitflags.Flags.Tiploc:
				return "Tiploc"
			case TiplocSearchFieldsBitflags.Flags.Name:
				return "Name";
			case TiplocSearchFieldsBitflags.Flags.Codes:
				return "Codes";
			default:
				return "unknown";
		}
	}

	/**
	 * Converts bitflag to string.
	 */
	public static ToCombinedString(v: number) {
		let o = "";

		Object.values(TiplocSearchFieldsBitflags.Flags).forEach(w => {
			if ((w & v) != 0) o += this.ToString(w) + ", ";
		});

		return o == "" ? "None" : o.trimEnd();
	}
}